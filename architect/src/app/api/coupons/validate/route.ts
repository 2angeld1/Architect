import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Debes proporcionar un código de cupón' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'El cupón no es válido o no existe' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Este cupón está desactivado' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ error: 'Este cupón ha expirado' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
      },
    });
  } catch (error) {
    console.error('[API Coupons Validate POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
