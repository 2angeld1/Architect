import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { sendTestimonialEmail } from '@/lib/mailer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';

    if (admin) {
      // Protect admin fetch with admin session check
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('admin_session')?.value;

      if (!sessionToken) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }

      const session = verifySession(sessionToken);
      if (!session || !session.userId) {
        return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
      }

      const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: testimonials,
      });
    }

    // Public request: Return only approved testimonials with 4 or 5 stars
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
        rating: { in: [4, 5] },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('[API Testimonials GET]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, rating, comment } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'El nombre, la calificación y el comentario son requeridos.' }, { status: 400 });
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: 'La calificación debe estar entre 1 y 5 estrellas.' }, { status: 400 });
    }

    // Create the testimonial in the database (default approved to rating >= 4, or false to moderate - let's make it false so admin moderates, but wait! Since rating is high, we can also auto-approve 4-5 stars or let admin approve. Let's default to false so admin ALWAYS has final approval, or let's auto-approve 5 stars but let them hide it. Default to approved: false is the safest for real businesses to avoid spam!)
    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role ? role.trim() : null,
        rating: ratingVal,
        comment: comment.trim(),
        approved: false, // Default to unapproved until reviewed by admin
      },
    });

    // Fetch configured office email for notifications
    const emailSetting = await prisma.pageContent.findUnique({
      where: {
        page_section_key: {
          page: 'global',
          section: 'contact',
          key: 'email',
        },
      },
    });
    
    const toEmail = emailSetting?.value || process.env.SMTP_FROM || 'contacto@archiquect.com';

    // Send notification email in the background (non-blocking)
    try {
      await sendTestimonialEmail(toEmail, {
        name: testimonial.name,
        role: testimonial.role || undefined,
        rating: testimonial.rating,
        comment: testimonial.comment,
      });
    } catch (mailErr) {
      console.error('Failed to send testimonial notification email:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonio enviado con éxito. Será revisado por nuestro equipo.',
      data: testimonial,
    });
  } catch (error) {
    console.error('[API Testimonials POST]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
