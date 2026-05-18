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

    const primaryMenu = await prisma.pageContent.findUnique({
      where: {
        page_section_key: {
          page: 'global',
          section: 'menu',
          key: 'primary',
        },
      },
    });

    const secondaryMenu = await prisma.pageContent.findUnique({
      where: {
        page_section_key: {
          page: 'global',
          section: 'menu',
          key: 'secondary',
        },
      },
    });

    return NextResponse.json({
      success: true,
      menuPrimary: primaryMenu?.value ? JSON.parse(primaryMenu.value) : [],
      menuSecondary: secondaryMenu?.value ? JSON.parse(secondaryMenu.value) : [],
    });
  } catch (error) {
    console.error('Error fetching admin menus:', error);
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
    const { primaryLinks, secondaryLinks } = body;

    if (!primaryLinks || !Array.isArray(primaryLinks) || !secondaryLinks || !Array.isArray(secondaryLinks)) {
      return NextResponse.json({ error: 'Estructura de menús no válida' }, { status: 400 });
    }

    // Guardar menú primario
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: 'global',
          section: 'menu',
          key: 'primary',
        },
      },
      update: { value: JSON.stringify(primaryLinks) },
      create: {
        page: 'global',
        section: 'menu',
        key: 'primary',
        value: JSON.stringify(primaryLinks),
      },
    });

    // Guardar menú secundario
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: 'global',
          section: 'menu',
          key: 'secondary',
        },
      },
      update: { value: JSON.stringify(secondaryLinks) },
      create: {
        page: 'global',
        section: 'menu',
        key: 'secondary',
        value: JSON.stringify(secondaryLinks),
      },
    });

    // Emitir cambio de contenido en tiempo real
    cmsEvents.broadcastCMSChange('global');

    return NextResponse.json({
      success: true,
      message: 'Menús de navegación actualizados con éxito',
    });
  } catch (error) {
    console.error('Error saving admin menus:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
