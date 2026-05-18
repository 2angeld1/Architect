import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({
        success: false,
        valid: false,
        errors: [{ msg: 'El proyecto es requerido', path: 'projectId' }],
      }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({
        success: false,
        valid: false,
        errors: [{ msg: 'Proyecto no encontrado', path: 'projectId' }],
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      message: 'Datos válidos para procesar',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
