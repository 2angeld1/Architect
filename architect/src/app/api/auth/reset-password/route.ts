import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'El token y la nueva contraseña son obligatorios' }, { status: 400 });
    }

    // Buscar el usuario que tenga este token y que no haya expirado
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date(), // El token es mayor que la hora actual (no ha expirado)
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'El token es inválido o ha expirado' }, { status: 400 });
    }

    const hashedPassword = hashPassword(newPassword);

    // Actualizar la contraseña del usuario y limpiar el token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tu contraseña ha sido restablecida con éxito',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Error al restablecer la contraseña' }, { status: 500 });
  }
}
