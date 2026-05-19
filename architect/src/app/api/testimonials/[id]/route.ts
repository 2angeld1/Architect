import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Secure endpoint with admin check
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = verifySession(sessionToken);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }

    const body = await request.json();
    const { approved } = body;

    if (approved === undefined) {
      return NextResponse.json({ error: 'Falta campo aprobado' }, { status: 400 });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { approved: !!approved },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('[API Testimonials PATCH]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Secure endpoint with admin check
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = verifySession(sessionToken);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonio eliminado con éxito.',
    });
  } catch (error) {
    console.error('[API Testimonials DELETE]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
