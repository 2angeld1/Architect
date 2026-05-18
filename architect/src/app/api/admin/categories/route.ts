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

    const categoriesConfig = await prisma.pageContent.findUnique({
      where: {
        page_section_key: {
          page: 'global',
          section: 'categories',
          key: 'list',
        },
      },
    });

    return NextResponse.json({
      success: true,
      categoriesList: categoriesConfig?.value ? JSON.parse(categoriesConfig.value) : [],
    });
  } catch (error) {
    console.error('Error fetching admin categories:', error);
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
    const { categoriesList } = body;

    if (!categoriesList || !Array.isArray(categoriesList)) {
      return NextResponse.json({ error: 'Categorías no válidas' }, { status: 400 });
    }

    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: 'global',
          section: 'categories',
          key: 'list',
        },
      },
      update: { value: JSON.stringify(categoriesList) },
      create: {
        page: 'global',
        section: 'categories',
        key: 'list',
        value: JSON.stringify(categoriesList),
      },
    });

    // Broadcast change in real-time to all clients (SSE)
    cmsEvents.broadcastCMSChange('global');

    return NextResponse.json({
      success: true,
      message: 'Categorías actualizadas con éxito',
    });
  } catch (error) {
    console.error('Error saving admin categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
