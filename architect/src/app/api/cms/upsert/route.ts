import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cmsEvents } from '@/lib/cmsEvents';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Verify admin session for safety
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const session = verifySession(sessionToken);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { page, section, key, value, type } = body;

    if (!page || !section || !key) {
      return NextResponse.json({ error: 'Faltan parámetros obligatorios' }, { status: 400 });
    }

    const content = await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page,
          section,
          key
        }
      },
      update: {
        value
      },
      create: {
        page,
        section,
        key,
        value,
        type: type || 'text'
      }
    });

    // Broadcast change in real-time
    cmsEvents.broadcastCMSChange(page);

    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('CMS Upsert error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
