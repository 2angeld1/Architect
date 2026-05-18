import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cmsEvents } from '@/lib/cmsEvents';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    const where = page ? { page } : {};
    
    const content = await prisma.pageContent.findMany({
      where,
    });

    // Format into an easily usable object { [key]: value }
    const formattedContent = content.reduce((acc: any, item: any) => {
      acc[`${item.section}_${item.key}`] = item.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      success: true,
      data: content,
      formatted: formattedContent
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, value } = body;

    const content = await prisma.pageContent.update({
      where: { id },
      data: { value }
    });

    // Broadcast change in real-time
    cmsEvents.broadcastCMSChange(content.page);

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, section, key, value, type } = body;

    const content = await prisma.pageContent.create({
      data: {
        page,
        section,
        key,
        value,
        type: type || 'text'
      }
    });

    // Broadcast change in real-time
    cmsEvents.broadcastCMSChange(content.page);

    return NextResponse.json({
      success: true,
      data: content,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    const existing = await prisma.pageContent.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content block not found' }, { status: 404 });
    }

    await prisma.pageContent.delete({
      where: { id }
    });

    // Broadcast change in real-time
    cmsEvents.broadcastCMSChange(existing.page);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

