import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cmsEvents } from '@/lib/cmsEvents';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verificar si el proyecto existe
    const exists = await prisma.project.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Primero eliminar reservaciones asociadas para no violar restricciones FK si las hay
    await prisma.reservation.deleteMany({
      where: { projectId: id },
    });

    // Eliminar el proyecto
    await prisma.project.delete({
      where: { id },
    });

    // Disparar recarga en tiempo real en los clientes
    cmsEvents.broadcastCMSChange('global');

    return NextResponse.json({
      success: true,
      message: 'Proyecto eliminado con éxito',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar si el proyecto existe
    const exists = await prisma.project.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Actualizar el proyecto
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price !== undefined ? Number(body.price) : undefined,
        images: body.images,
        area: body.area !== undefined ? Number(body.area) : undefined,
        rooms: body.rooms !== undefined ? Number(body.rooms) : undefined,
        bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : undefined,
        floors: body.floors !== undefined ? Number(body.floors) : undefined,
        style: body.style,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
    });

    // Disparar recarga en tiempo real en los clientes
    cmsEvents.broadcastCMSChange('global');

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
