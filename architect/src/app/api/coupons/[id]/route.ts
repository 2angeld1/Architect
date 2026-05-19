import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { isActive, code, discountType, value, expiresAt } = body;

    const data: any = {};
    if (isActive !== undefined) data.isActive = isActive;
    if (code !== undefined) data.code = code.toUpperCase().trim();
    if (discountType !== undefined) data.discountType = discountType;
    if (value !== undefined) data.value = parseFloat(value);
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const coupon = await prisma.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error('[API Coupons PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Cupón eliminado correctamente',
    });
  } catch (error) {
    console.error('[API Coupons DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
