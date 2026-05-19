import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error('[API Coupons GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, value, expiresAt } = body;

    if (!code || !discountType || value === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'El código de cupón ya existe' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType,
        value: parseFloat(value),
        isActive: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: coupon,
    }, { status: 201 });
  } catch (error) {
    console.error('[API Coupons POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
