import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Obtener todos los compradores con sus correspondientes reservas
    const buyers = await prisma.buyer.findMany({
      include: {
        reservations: {
          select: {
            id: true,
            reservationNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calcular estadísticas adicionales para cada cliente (ej. total invertido, total reservas)
    const formattedClients = buyers.map((buyer: any) => {
      const totalSpent = (buyer.reservations as any[])
        .filter((res: any) => res.status === 'confirmed' || res.status === 'completed')
        .reduce((sum: number, res: any) => sum + Number(res.totalAmount), 0);

      return {
        ...buyer,
        totalSpent,
        reservationsCount: buyer.reservations.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedClients,
    });
  } catch (error) {
    console.error('Fetch clients error:', error);
    return NextResponse.json({ error: 'Error al cargar clientes' }, { status: 500 });
  }
}
