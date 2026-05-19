import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cmsEvents } from '@/lib/cmsEvents';

const defaultCategories = [
  {
    id: 1779141064701,
    name: 'Casas Modernas',
    description: 'Diseños contemporáneos con líneas limpias y espacios abiertos',
    count: 0,
    iconName: 'Home',
    query: 'modern house architecture exterior',
    subcategories: ['Minimalista', 'Industrial', 'Contemporáneo', 'High-Tech'],
  },
  {
    id: 1779141064702,
    name: 'Minimalistas',
    description: 'Líneas puras, colores neutros y la belleza de la simplicidad absoluta',
    count: 0,
    iconName: 'Minimize2',
    query: 'minimalist house concrete',
    subcategories: ['Minimalismo', 'Geométrico', 'Zen', 'Monocromático'],
  },
  {
    id: 1779141064703,
    name: 'Con Jardín',
    description: 'Espacios residenciales integrados con la naturaleza y amplias áreas verdes',
    count: 0,
    iconName: 'TreePine',
    query: 'modern house garden pool',
    subcategories: ['Paisajismo', 'Sustentable', 'Terrazas', 'Biofílico'],
  },
  {
    id: 1779141064704,
    name: 'Dos Pisos',
    description: 'Viviendas de dos niveles que maximizan el espacio y la funcionalidad familiar',
    count: 0,
    iconName: 'Layers',
    query: 'two story modern house',
    subcategories: ['Duplex', 'Loft', 'Familiar', 'Doble Altura'],
  },
  {
    id: 1779141064705,
    name: 'Departamentos',
    description: 'Soluciones residenciales verticales elegantes y optimizadas',
    count: 0,
    iconName: 'Building2',
    query: 'modern apartment building exterior',
    subcategories: ['Condominio', 'Penthouse', 'Estudio', 'Urbano'],
  },
  {
    id: 1779141064706,
    name: 'Con Garaje',
    description: 'Proyectos residenciales diseñados con estacionamiento integrado y seguro',
    count: 0,
    iconName: 'Car',
    query: 'modern house garage drive',
    subcategories: ['Cochera', 'Subterráneo', 'Fachada', 'Automatizado'],
  }
];

export async function GET() {
  try {
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
      categoriesList: categoriesConfig?.value ? JSON.parse(categoriesConfig.value) : defaultCategories,
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
