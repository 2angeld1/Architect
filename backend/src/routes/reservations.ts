import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/reservations - Obtener todas las reservas
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        project: true,
        buyer: true,
        paymentInfo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: reservations,
      total: reservations.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reservations/:id - Obtener una reserva por ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        project: true,
        buyer: true,
        paymentInfo: true,
      },
    });

    if (!reservation) {
      throw createError('Reserva no encontrada', 404);
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reservations/number/:reservationNumber - Obtener por número de reserva
router.get('/number/:reservationNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reservationNumber } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { reservationNumber },
      include: {
        project: true,
        buyer: true,
        paymentInfo: true,
      },
    });

    if (!reservation) {
      throw createError('Reserva no encontrada', 404);
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/reservations/:id/status - Actualizar estado de reserva
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw createError('Estado inválido', 400);
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { 
        status,
        ...(status === 'confirmed' && { confirmedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date() }),
        ...(status === 'cancelled' && { cancelledAt: new Date() }),
      },
      include: {
        project: true,
        buyer: true,
        paymentInfo: true,
      },
    });

    res.json({
      success: true,
      data: reservation,
      message: `Reserva actualizada a estado: ${status}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
