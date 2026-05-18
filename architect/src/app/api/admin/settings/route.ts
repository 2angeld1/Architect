import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession, hashPassword, verifyPassword } from '@/lib/auth';
import { cmsEvents } from '@/lib/cmsEvents';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = verifySession(sessionToken);
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }

    // 1. Obtener datos del usuario
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // 2. Obtener variables globales de configuración guardadas en PageContent
    const globalSettings = await prisma.pageContent.findMany({
      where: { page: 'global' },
    });

    // Formatear a objeto clave-valor simple
    const settingsMap: Record<string, string> = {};
    globalSettings.forEach((item: any) => {
      settingsMap[`${item.section}_${item.key}`] = item.value;
    });

    return NextResponse.json({
      success: true,
      user,
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Error al cargar configuraciones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
    const { 
      name, 
      currentPassword, 
      newPassword,
      // Configs globales
      contactEmail,
      contactPhone,
      officeAddress,
      instagramUrl,
      facebookUrl
    } = body;

    // 1. Actualización de perfil del Administrador
    if (name || newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 });
      }

      const updateData: { name?: string; password?: string } = {};

      if (name) {
        updateData.name = name;
      }

      if (newPassword) {
        if (!currentPassword) {
          return NextResponse.json({ error: 'Debes introducir tu contraseña actual para cambiarla' }, { status: 400 });
        }

        const isMatch = verifyPassword(currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
        }

        updateData.password = hashPassword(newPassword);
      }

      await prisma.user.update({
        where: { id: session.userId },
        data: updateData,
      });
    }

    // 2. Actualización de variables de configuración global en PageContent
    const { primaryLinks, secondaryLinks, categoriesList } = body;
    const globalConfigs = [
      { section: 'contact', key: 'email', value: contactEmail },
      { section: 'contact', key: 'phone', value: contactPhone },
      { section: 'contact', key: 'address', value: officeAddress },
      { section: 'social', key: 'instagram', value: instagramUrl },
      { section: 'social', key: 'facebook', value: facebookUrl },
      { section: 'menu', key: 'primary', value: primaryLinks ? JSON.stringify(primaryLinks) : undefined },
      { section: 'menu', key: 'secondary', value: secondaryLinks ? JSON.stringify(secondaryLinks) : undefined },
      { section: 'categories', key: 'list', value: categoriesList ? JSON.stringify(categoriesList) : undefined },
    ];

    for (const config of globalConfigs) {
      if (config.value !== undefined) {
        await prisma.pageContent.upsert({
          where: {
            page_section_key: {
              page: 'global',
              section: config.section,
              key: config.key,
            },
          },
          update: { value: config.value },
          create: {
            page: 'global',
            section: config.section,
            key: config.key,
            value: config.value,
            type: 'text',
          },
        });
      }
    }

    // Broadcast change in real-time to all clients (SSE)
    cmsEvents.broadcastCMSChange('global');

    return NextResponse.json({
      success: true,
      message: 'Configuraciones guardadas con éxito',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Error al actualizar configuraciones' }, { status: 500 });
  }
}
