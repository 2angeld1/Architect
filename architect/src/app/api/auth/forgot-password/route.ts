import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendResetPasswordEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es obligatorio' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, devolvemos success aunque el usuario no exista para evitar enumeración de correos
      return NextResponse.json({
        success: true,
        message: 'Si el correo electrónico está registrado, recibirás un mensaje de recuperación.',
      });
    }

    // Generar un token aleatorio y seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Expiración: 1 hora
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar el token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    // Crear el enlace para restablecer la contraseña
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/admin/reset-password?token=${resetToken}`;

    // Enviar el correo usando Brevo
    await sendResetPasswordEmail(user.email, resetLink);

    return NextResponse.json({
      success: true,
      message: 'Si el correo electrónico está registrado, recibirás un mensaje de recuperación.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de recuperación' }, { status: 500 });
  }
}
