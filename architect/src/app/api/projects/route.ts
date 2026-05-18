import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: projects,
      total: projects.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We set default missing values for Prisma schema to be satisfied
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        category: body.category as any,
        price: body.price,
        area: body.area || 0,
        rooms: body.rooms || 0,
        bathrooms: body.bathrooms || 0,
        floors: body.floors || 1,
        style: body.style || 'Moderno',
        images: body.images || [],
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: project,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
