import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

const generateReservationNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RES-${timestamp}-${random}`;
};

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { projectId, reservationType, buyer, payment } = body;

    if (!projectId || !reservationType || !buyer || !payment) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    if (!project.isActive) {
      return NextResponse.json({ error: 'Este proyecto ya no está disponible' }, { status: 400 });
    }

    const reservation = await prisma.$transaction(async (tx) => {
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
            documentType: buyer.documentType as any,
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
        existingBuyer = await tx.buyer.update({
          where: { id: existingBuyer.id },
          data: {
            firstName: buyer.firstName,
            lastName: buyer.lastName,
            phone: buyer.phone,
            documentType: buyer.documentType as any,
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

      const paymentInfo = await tx.paymentInfo.create({
        data: {
          paymentMethod: payment.paymentMethod as any,
          cardholderName: payment.cardholderName,
          billingSameAsShipping: payment.billingAddress?.sameAsShipping ?? true,
          billingAddress: payment.billingAddress?.address,
          billingCity: payment.billingAddress?.city,
          billingState: payment.billingAddress?.state,
          billingCountry: payment.billingAddress?.country,
          billingPostalCode: payment.billingAddress?.postalCode,
        },
      });

      const newReservation = await tx.reservation.create({
        data: {
          reservationNumber: generateReservationNumber(),
          projectId: project.id,
          buyerId: existingBuyer.id,
          paymentInfoId: paymentInfo.id,
          type: reservationType as any,
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

    return NextResponse.json({
      success: true,
      data: reservation,
      message: reservationType === 'quote' 
        ? 'Solicitud de cotización creada exitosamente' 
        : 'Reserva creada exitosamente',
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
