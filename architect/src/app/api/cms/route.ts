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

    // Auto-seed 'global' content if empty
    if (page === 'global' && content.length === 0) {
      const defaults = [
        { page: 'global', section: 'footer', key: 'description', value: 'Más de 15 años diseñando espacios que inspiran. Planos arquitectónicos de alta calidad listos para construir.', type: 'text' },
        { page: 'global', section: 'footer', key: 'address', value: 'Av. Reforma 123, Col. Centro, Ciudad de México, México', type: 'text' },
        { page: 'global', section: 'footer', key: 'phone', value: '+52 55 1234 5678', type: 'text' },
        { page: 'global', section: 'footer', key: 'email', value: 'contacto@archiquect.com', type: 'text' },
        { page: 'global', section: 'announcement', key: 'promo_banner_active', value: 'false', type: 'text' },
        { page: 'global', section: 'announcement', key: 'promo_banner_text', value: '✨ ¡OFERTA LIMITADA! Obtén un 15% de descuento en todos los planos usando el código PLAN15', type: 'text' },
        { page: 'global', section: 'announcement', key: 'promo_banner_code', value: 'PLAN15', type: 'text' }
      ];

      await prisma.pageContent.createMany({
        data: defaults
      });

      content = await prisma.pageContent.findMany({
        where,
      });
    }

    // Auto-seed 'home' content if empty
    if (page === 'home' && content.length === 0) {
      const defaults = [
        { page: 'home', section: 'hero', key: 'slide1_title', value: 'Diseña tu Hogar Ideal', type: 'text' },
        { page: 'home', section: 'hero', key: 'slide1_subtitle', value: 'Más de 500 proyectos arquitectónicos listos para construir', type: 'text' },
        { page: 'home', section: 'hero', key: 'slide1_image', value: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&fit=crop', type: 'image' },
        
        { page: 'home', section: 'hero', key: 'slide2_title', value: 'Arquitectura Moderna', type: 'text' },
        { page: 'home', section: 'hero', key: 'slide2_subtitle', value: 'Planos detallados con las últimas tendencias de diseño', type: 'text' },
        { page: 'home', section: 'hero', key: 'slide2_image', value: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&fit=crop', type: 'image' },
        
        { page: 'home', section: 'hero', key: 'slide3_title', value: 'Tu Proyecto, Tu Estilo', type: 'text' },
        { page: 'home', section: 'hero', key: 'slide3_subtitle', value: 'Casas modernas, clásicas y contemporáneas', type: 'text' },
        { page: 'home', section: 'hero', key: 'slide3_image', value: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80&fit=crop', type: 'image' },

        { page: 'home', section: 'process', key: 'badge', value: '¿Cómo funciona?', type: 'text' },
        { page: 'home', section: 'process', key: 'title', value: 'Tu camino hacia el hogar ideal', type: 'text' },
        { page: 'home', section: 'process', key: 'description', value: 'Simplificamos el complejo proceso de arquitectura para que puedas enfocarte en lo importante: construir tu futuro.', type: 'text' },
        
        { page: 'home', section: 'process', key: 'step1_title', value: 'Explora y Elige', type: 'text' },
        { page: 'home', section: 'process', key: 'step1_desc', value: 'Navega por nuestra selección de planos y encuentra el diseño perfecto para tu estilo de vida.', type: 'text' },
        
        { page: 'home', section: 'process', key: 'step2_title', value: 'Personaliza', type: 'text' },
        { page: 'home', section: 'process', key: 'step2_desc', value: 'Adaptamos las dimensiones, distribución y fachadas del plano a las condiciones de tu terreno.', type: 'text' },
        
        { page: 'home', section: 'process', key: 'step3_title', value: 'Descarga inmediata', type: 'text' },
        { page: 'home', section: 'process', key: 'step3_desc', value: 'Obtén planos técnicos completos listos para radicar y tramitar licencias de construcción.', type: 'text' },
        
        { page: 'home', section: 'process', key: 'step4_title', value: 'Construye', type: 'text' },
        { page: 'home', section: 'process', key: 'step4_desc', value: 'Te conectamos con los mejores constructores locales y te asesoramos durante todo el proceso.', type: 'text' },
        
        { page: 'home', section: 'comparison', key: 'badge', value: 'Toma la mejor decisión', type: 'text' },
        { page: 'home', section: 'comparison', key: 'title', value: '¿Por qué elegir un proyecto listo?', type: 'text' },
        { page: 'home', section: 'comparison', key: 'description', value: 'Compara las ventajas de nuestros proyectos listos para construir frente al proceso tradicional.', type: 'text' },
        
        { page: 'home', section: 'contact', key: 'badge', value: 'Estamos aquí para ti', type: 'text' },
        { page: 'home', section: 'contact', key: 'title', value: '¿Tienes un proyecto en mente?', type: 'text' },
        { page: 'home', section: 'contact', key: 'description', value: 'Nuestro equipo de expertos está listo para ayudarte a encontrar el proyecto perfecto o crear una cotización personalizada para tu próximo hogar.', type: 'text' },
        { page: 'home', section: 'contact', key: 'hours_week', value: 'Lun - Vie: 9:00 - 18:00', type: 'text' },
        { page: 'home', section: 'contact', key: 'hours_sat', value: 'Sáb: 9:00 - 14:00', type: 'text' },

        { page: 'home', section: 'benefits', key: 'benefits_count', value: '6', type: 'text' },
        { page: 'home', section: 'benefits', key: 'badge', value: '¿Por qué elegirnos?', type: 'text' },
        { page: 'home', section: 'benefits', key: 'title', value: 'Beneficios de Comprar con Nosotros', type: 'text' },
        { page: 'home', section: 'benefits', key: 'description', value: 'Más de 15 años de experiencia respaldan cada uno de nuestros proyectos', type: 'text' },
        
        { page: 'home', section: 'benefits', key: 'item1_title', value: 'Compra Segura', type: 'text' },
        { page: 'home', section: 'benefits', key: 'item1_desc', value: 'Pagos protegidos y garantía de satisfacción en cada proyecto', type: 'text' },
        
        { page: 'home', section: 'benefits', key: 'item2_title', value: 'Entrega Inmediata', type: 'text' },
        { page: 'home', section: 'benefits', key: 'item2_desc', value: 'Descarga tus planos al instante después de la compra', type: 'text' },
        
        { page: 'home', section: 'benefits', key: 'item3_title', value: 'Calidad Premium', type: 'text' },
        { page: 'home', section: 'benefits', key: 'item3_desc', value: 'Diseños que cumplen normativas locales e internacionales', type: 'text' },
        
        { page: 'home', section: 'benefits', key: 'item4_title', value: 'Soporte Experto', type: 'text' },
        { page: 'home', section: 'benefits', key: 'item4_desc', value: 'Asesoría profesional durante todo el proceso', type: 'text' },
        
        { page: 'home', section: 'benefits', key: 'item5_title', value: 'Envío Gratis', type: 'text' },
        { page: 'home', section: 'benefits', key: 'item5_desc', value: 'Documentación física sin costo adicional', type: 'text' },
        
        { page: 'home', section: 'benefits', key: 'item6_title', value: 'Garantía de Cambio', type: 'text' },
        { page: 'home', section: 'benefits', key: 'item6_desc', value: '30 días para cambiar tu proyecto si no te convence', type: 'text' },

        { page: 'home', section: 'benefits', key: 'trust_title', value: 'Confía en los expertos', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_desc', value: 'Únete a más de 10,000 familias que ya construyeron su hogar con nuestros proyectos', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat1_num', value: '500+', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat1_label', value: 'Proyectos', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat2_num', value: '10K+', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat2_label', value: 'Clientes', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat3_num', value: '15+', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat3_label', value: 'Años', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat4_num', value: '98%', type: 'text' },
        { page: 'home', section: 'benefits', key: 'trust_stat4_label', value: 'Satisfacción', type: 'text' }
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

