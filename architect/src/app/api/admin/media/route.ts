import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cmsEvents } from '@/lib/cmsEvents';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('admin_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const session = await verifySession(sessionCookie);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const mediaLibrary = await prisma.pageContent.findUnique({
      where: {
        page_section_key: {
          page: 'global',
          section: 'media',
          key: 'library',
        },
      },
    });

    return NextResponse.json({
      success: true,
      images: mediaLibrary?.value ? JSON.parse(mediaLibrary.value) : [],
    });
  } catch (error) {
    console.error('Error fetching media library:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('admin_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const session = await verifySession(sessionCookie);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      return NextResponse.json({ error: 'Estructura de galería de medios no válida' }, { status: 400 });
    }

    // Guardar biblioteca de medios
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: 'global',
          section: 'media',
          key: 'library',
        },
      },
      update: { value: JSON.stringify(images) },
      create: {
        page: 'global',
        section: 'media',
        key: 'library',
        value: JSON.stringify(images),
      },
    });

    // Emitir cambio de contenido en tiempo real
    cmsEvents.broadcastCMSChange('global');

    return NextResponse.json({
      success: true,
      message: 'Biblioteca de medios actualizada con éxito',
    });
  } catch (error) {
    console.error('Error saving media library:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
