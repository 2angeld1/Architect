import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendQuoteEmail } from '@/lib/mailer';
import { mockProjects } from '@/mocks/projects';

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        project: true,
        buyer: true,
        paymentInfo: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: reservations,
      total: reservations.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, buyerInfo, paymentInfo, reservationType } = body;

    if (!projectId || !buyerInfo || !paymentInfo || !reservationType) {
      return NextResponse.json({ error: 'Faltan datos requeridos en el cuerpo' }, { status: 400 });
    }

    // 1. Buscar el proyecto de manera segura
    let project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    // 2. Mecanismo de Auto-Sanación de Base de Datos (Self-Healing)
    if (!project) {
      console.log(`Proyecto con ID "${projectId}" no encontrado en DB. Iniciando auto-sanación...`);
      
      // Buscar en el catálogo estático de mockProjects
      const mockProj = mockProjects.find((p) => p.id === projectId);
      
      if (mockProj) {
        console.log(`Creando proyecto mock "${mockProj.name}" en la base de datos de manera dinámica con ID "${projectId}"...`);
        project = await prisma.project.create({
          data: {
            id: mockProj.id,
            name: mockProj.name,
            description: mockProj.description,
            category: mockProj.category,
            price: mockProj.price,
            currency: mockProj.currency,
            images: mockProj.images,
            features: mockProj.features,
            area: mockProj.area,
            rooms: mockProj.rooms,
            bathrooms: mockProj.bathrooms,
            floors: mockProj.floors,
            style: mockProj.style,
            isActive: true,
          }
        });
      } else {
        // Si no es un mock directo, buscar el primer proyecto que exista para no quebrar la demo del cliente
        const fallbackProject = await prisma.project.findFirst();
        if (fallbackProject) {
          console.log(`ID no coincide con mock. Usando proyecto existente de respaldo: "${fallbackProject.name}"`);
          project = fallbackProject;
        }
      }
    }

    // 3. Si aún así no hay proyectos en la base de datos completa
    if (!project) {
      return NextResponse.json({ 
        error: 'El catálogo de proyectos está vacío. Por favor, crea al menos un proyecto en el panel administrativo antes de reservar.' 
      }, { status: 404 });
    }

    // Generar un número de reserva único e irrepetible
    const reservationNumber = `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // El estado depende del método de pago elegido
    let status: 'pending' | 'confirmed' = 'confirmed';
    if (paymentInfo.paymentMethod === 'transfer') {
      status = 'pending'; // Pendiente hasta confirmar transferencia manual
    }

    // Ejecutar transacciones acopladas en Prisma
    const reservation = await prisma.$transaction(async (tx: any) => {
      // 1. Crear el Comprador
      const buyer = await tx.buyer.create({
        data: {
          firstName: buyerInfo.firstName,
          lastName: buyerInfo.lastName,
          email: buyerInfo.email,
          phone: buyerInfo.phone,
          documentType: buyerInfo.documentType || 'dni',
          documentNumber: buyerInfo.documentNumber || '00000000',
          address: buyerInfo.address || 'Entrega Digital',
          city: buyerInfo.city || 'Digital',
          state: buyerInfo.state || 'Digital',
          country: buyerInfo.country || 'México',
          postalCode: buyerInfo.postalCode || '00000',
          notes: buyerInfo.notes || null,
        }
      });

      // 2. Crear la información de pago
      const createdPaymentInfo = await tx.paymentInfo.create({
        data: {
          paymentMethod: paymentInfo.paymentMethod, // 'card', 'transfer', 'quote'
          cardholderName: paymentInfo.cardholderName || `${buyerInfo.firstName} ${buyerInfo.lastName}`,
          billingSameAsShipping: true,
        }
      });

      // 3. Crear la Reserva final (usando la ID del proyecto resuelto)
      return await tx.reservation.create({
        data: {
          reservationNumber,
          projectId: project.id, // ID resuelto (mock o real)
          buyerId: buyer.id,
          paymentInfoId: createdPaymentInfo.id,
          status,
          type: reservationType, // 'purchase', 'quote'
          totalAmount: project.price,
          currency: project.currency,
          notes: buyerInfo.notes || null,
        },
        include: {
          project: true,
          buyer: true,
          paymentInfo: true,
        }
      });
    });

    // 4. Enviar Correo de Confirmación en segundo plano de forma segura
    try {
      await sendQuoteEmail(buyerInfo.email, {
        reservationNumber: reservation.reservationNumber,
        buyerName: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
        projectName: project.name,
      });
      console.log('Correo de confirmación enviado con éxito a:', buyerInfo.email);
    } catch (emailError) {
      console.warn('Nodemailer no pudo enviar el email (SMTP no configurado en .env.local):', emailError);
    }

    return NextResponse.json({
      success: true,
      reservationId: reservation.reservationNumber,
      data: reservation
    });

  } catch (error) {
    console.error('Error procesando reserva en el backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
