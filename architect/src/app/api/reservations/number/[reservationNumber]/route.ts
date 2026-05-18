import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ reservationNumber: string }> }) {
  try {
    const { reservationNumber } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { reservationNumber },
      include: {
        project: true,
        buyer: true,
        paymentInfo: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
