import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cmsEvents } from '@/lib/cmsEvents';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    const where = page ? { page } : {};
    
    let content = await prisma.pageContent.findMany({
      where,
    });

    // Auto-seed 'construccion' page content if empty
    if (page === 'construccion' && content.length === 0) {
      const defaults = [
        { page: 'construccion', section: 'hero', key: 'title', value: 'Construyendo una Casa', type: 'text' },
        { page: 'construccion', section: 'hero', key: 'subtitle', value: 'Entendemos que construir tu hogar es una de las decisiones más importantes de tu vida. Aquí te explicamos cómo hacemos que el proceso sea sencillo, transparente y emocionante.', type: 'text' },
        
        { page: 'construccion', section: 'howItWorks', key: 'title', value: 'Del Papel a la Realidad', type: 'text' },
        { page: 'construccion', section: 'howItWorks', key: 'desc1', value: 'Muchos clientes llegan con incertidumbre sobre el proceso de construcción. ¿Cuánto costará realmente? ¿Cuánto tiempo tomará? En Archiquect eliminamos esas dudas con nuestro sistema de gestión integral.', type: 'text' },
        { page: 'construccion', section: 'howItWorks', key: 'desc2', value: 'No solo vendemos planos; ofrecemos un acompañamiento completo para que tu experiencia de construcción sea libre de estrés.', type: 'text' },
        { page: 'construccion', section: 'howItWorks', key: 'image', value: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { page: 'construccion', section: 'howItWorks', key: 'badgeYears', value: '15+ Años', type: 'text' },
        { page: 'construccion', section: 'howItWorks', key: 'badgeDesc', value: 'De experiencia construyendo sueños en todo el país.', type: 'text' },
        
        { page: 'construccion', section: 'benefits', key: 'title', value: '¿Por qué elegirnos?', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'subtitle', value: 'Beneficios diseñados para tu tranquilidad y economía.', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'benefit1_title', value: 'Precio Cerrado', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'benefit1_desc', value: 'Sin sorpresas ni costos ocultos.', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'benefit2_title', value: 'Diseño Personalizado', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'benefit2_desc', value: 'Adaptamos cualquier modelo a tus necesidades.', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'benefit3_title', value: 'Supervisión Técnica', type: 'text' },
        { page: 'construccion', section: 'benefits', key: 'benefit3_desc', value: 'Ingenieros y arquitectos a cargo de tu obra.', type: 'text' },
        
        { page: 'construccion', section: 'steps', key: 'title', value: 'Pasos para construir tu hogar', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step1_title', value: '1. Elige tu Diseño', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step1_desc', value: 'Explora nuestra colección y selecciona el plano que mejor se adapte a tu terreno y estilo de vida.', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step2_title', value: '2. Adaptación del Terreno', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step2_desc', value: 'Nuestros expertos revisan la topografía de tu terreno para asegurar que la construcción sea viable.', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step3_title', value: '3. Permisos y Trámites', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step3_desc', value: 'Te asesoramos con toda la documentación necesaria para obtener las licencias de construcción.', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step4_title', value: '4. Construcción', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step4_desc', value: 'Supervisión experta durante todo el proceso de obra para garantizar la calidad.', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step5_title', value: '5. Entrega de Llaves', type: 'text' },
        { page: 'construccion', section: 'steps', key: 'step5_desc', value: 'Recibe tu casa terminada, limpia y lista para habitar. Garantía por escrito.', type: 'text' },
        
        { page: 'construccion', section: 'faq', key: 'title', value: 'Preguntas Frecuentes', type: 'text' },
        { page: 'construccion', section: 'faq', key: 'faq1_q', value: '¿Cuánto tiempo tarda la construcción?', type: 'text' },
        { page: 'construccion', section: 'faq', key: 'faq1_a', value: 'El tiempo promedio es de 6 a 9 meses, dependiendo del tamaño y complejidad del proyecto.', type: 'text' },
        { page: 'construccion', section: 'faq', key: 'faq2_q', value: '¿Puedo visitar la obra?', type: 'text' },
        { page: 'construccion', section: 'faq', key: 'faq2_a', value: '¡Claro! Fomentamos las visitas programadas para que veas el avance de tu futuro hogar.', type: 'text' },
        { page: 'construccion', section: 'faq', key: 'faq3_q', value: '¿Incluyen los trámites municipales?', type: 'text' },
        { page: 'construccion', section: 'faq', key: 'faq3_a', value: 'Sí, nuestro equipo legal y técnico se encarga de gestionar todos los permisos necesarios.', type: 'text' }
      ];

      await prisma.pageContent.createMany({
        data: defaults
      });

      content = await prisma.pageContent.findMany({
        where,
      });
    }

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

