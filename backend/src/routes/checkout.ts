import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Tipos para el request body
interface CheckoutRequestBody {
  projectId: string;
  reservationType: 'purchase' | 'quote';
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentType: 'dni' | 'passport' | 'ruc';
    documentNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    notes?: string;
  };
  payment: {
    paymentMethod: 'card' | 'transfer' | 'quote';
    cardholderName?: string;
    billingAddress?: {
      sameAsShipping: boolean;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  };
}

// Validaciones
const checkoutValidation = [
  body('projectId').notEmpty().withMessage('El proyecto es requerido'),
  body('reservationType').isIn(['purchase', 'quote']).withMessage('Tipo de reserva inválido'),
  body('buyer.firstName').notEmpty().withMessage('El nombre es requerido'),
  body('buyer.lastName').notEmpty().withMessage('El apellido es requerido'),
  body('buyer.email').isEmail().withMessage('Email inválido'),
  body('buyer.phone').notEmpty().withMessage('El teléfono es requerido'),
  body('buyer.documentType').isIn(['dni', 'passport', 'ruc']).withMessage('Tipo de documento inválido'),
  body('buyer.documentNumber').notEmpty().withMessage('El número de documento es requerido'),
  body('buyer.address').notEmpty().withMessage('La dirección es requerida'),
  body('buyer.city').notEmpty().withMessage('La ciudad es requerida'),
  body('buyer.state').notEmpty().withMessage('El estado es requerido'),
  body('buyer.postalCode').notEmpty().withMessage('El código postal es requerido'),
  body('payment.paymentMethod').isIn(['card', 'transfer', 'quote']).withMessage('Método de pago inválido'),
];

// Función para generar número de reserva único
const generateReservationNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RES-${timestamp}-${random}`;
};

// POST /api/checkout - Procesar checkout y crear reserva
router.post('/', checkoutValidation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { projectId, reservationType, buyer, payment } = req.body as CheckoutRequestBody;

    // Verificar que el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw createError('Proyecto no encontrado', 404);
    }

    if (!project.isActive) {
      throw createError('Este proyecto ya no está disponible', 400);
    }

    // Crear la reserva en una transacción
    const reservation = await prisma.$transaction(async (tx) => {
      // 1. Crear o encontrar el comprador
      let existingBuyer = await tx.buyer.findFirst({
        where: { email: buyer.email },
      });

      if (!existingBuyer) {
        existingBuyer = await tx.buyer.create({
          data: {
            firstName: buyer.firstName,
            lastName: buyer.lastName,
            email: buyer.email,
            phone: buyer.phone,
            documentType: buyer.documentType,
            documentNumber: buyer.documentNumber,
            address: buyer.address,
            city: buyer.city,
            state: buyer.state,
            country: buyer.country || 'México',
            postalCode: buyer.postalCode,
            notes: buyer.notes,
          },
        });
      } else {
        // Actualizar información del comprador
        existingBuyer = await tx.buyer.update({
          where: { id: existingBuyer.id },
          data: {
            firstName: buyer.firstName,
            lastName: buyer.lastName,
            phone: buyer.phone,
            documentType: buyer.documentType,
            documentNumber: buyer.documentNumber,
            address: buyer.address,
            city: buyer.city,
            state: buyer.state,
            country: buyer.country || 'México',
            postalCode: buyer.postalCode,
            notes: buyer.notes,
          },
        });
      }

      // 2. Crear información de pago
      const paymentInfo = await tx.paymentInfo.create({
        data: {
          paymentMethod: payment.paymentMethod,
          cardholderName: payment.cardholderName,
          billingSameAsShipping: payment.billingAddress?.sameAsShipping ?? true,
          billingAddress: payment.billingAddress?.address,
          billingCity: payment.billingAddress?.city,
          billingState: payment.billingAddress?.state,
          billingCountry: payment.billingAddress?.country,
          billingPostalCode: payment.billingAddress?.postalCode,
        },
      });

      // 3. Crear la reserva
      const newReservation = await tx.reservation.create({
        data: {
          reservationNumber: generateReservationNumber(),
          projectId: project.id,
          buyerId: existingBuyer.id,
          paymentInfoId: paymentInfo.id,
          type: reservationType,
          status: reservationType === 'quote' ? 'pending' : 'processing',
          totalAmount: reservationType === 'quote' ? 0 : project.price,
          currency: project.currency,
        },
        include: {
          project: true,
          buyer: true,
          paymentInfo: true,
        },
      });

      return newReservation;
    });

    // TODO: Aquí se integraría con Stripe para crear el PaymentIntent
    // si el método de pago es 'card'
    
    // TODO: Enviar email de confirmación

    res.status(201).json({
      success: true,
      data: reservation,
      message: reservationType === 'quote' 
        ? 'Solicitud de cotización creada exitosamente' 
        : 'Reserva creada exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/checkout/validate - Validar datos antes de procesar
router.post('/validate', checkoutValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      valid: false,
      errors: errors.array(),
    });
  }

  // Verificar que el proyecto existe
  const { projectId } = req.body;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return res.status(400).json({
      success: false,
      valid: false,
      errors: [{ msg: 'Proyecto no encontrado', path: 'projectId' }],
    });
  }

  res.json({
    success: true,
    valid: true,
    message: 'Datos válidos para procesar',
  });
});

// GET /api/checkout/summary/:projectId - Obtener resumen para checkout
router.get('/summary/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw createError('Proyecto no encontrado', 404);
    }

    res.json({
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          category: project.category,
          price: project.price,
          currency: project.currency,
          area: project.area,
          rooms: project.rooms,
          bathrooms: project.bathrooms,
        },
        subtotal: project.price,
        tax: 0, // Sin impuestos por ahora
        total: project.price,
        currency: project.currency,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
