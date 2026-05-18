import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.reservation.deleteMany();
  await prisma.paymentInfo.deleteMany();
  await prisma.buyer.deleteMany();
  await prisma.project.deleteMany();

  // Crear proyectos de ejemplo
  const projects = [
    {
      name: 'Casa Moderna Minimalista',
      description: 'Diseño contemporáneo con líneas limpias y espacios abiertos. Perfecta para familias que buscan un estilo de vida moderno con amplias áreas sociales y conexión con la naturaleza.',
      category: 'residencial',
      price: 2500,
      currency: 'USD',
      images: ['/placeholder-house-1.jpg'],
      features: [
        'Diseño de concepto open space',
        'Grandes ventanales con vista panorámica',
        'Terraza con pérgola',
        'Cocina integrada con isla',
        'Closets empotrados',
        'Estacionamiento para 2 vehículos'
      ],
      area: 180,
      rooms: 3,
      bathrooms: 2,
      floors: 2,
      style: 'Minimalista',
    },
    {
      name: 'Apartamento Urbano Loft',
      description: 'Espacio tipo loft ideal para profesionales urbanos. Diseño industrial con acabados contemporáneos y máximo aprovechamiento del espacio vertical.',
      category: 'residencial',
      price: 1800,
      currency: 'USD',
      images: ['/placeholder-loft-1.jpg'],
      features: [
        'Techo alto de 4 metros',
        'Mezzanine con estudio',
        'Cocina americana',
        'Baño principal con walk-in closet',
        'Iluminación LED empotrada',
        'Balcón con jardinera'
      ],
      area: 95,
      rooms: 2,
      bathrooms: 1,
      floors: 2,
      style: 'Industrial',
    },
    {
      name: 'Villa Campestre',
      description: 'Residencia de campo con arquitectura tradicional renovada. Ideal para quienes buscan escapar de la ciudad sin perder las comodidades modernas.',
      category: 'residencial',
      price: 4500,
      currency: 'USD',
      images: ['/placeholder-villa-1.jpg'],
      features: [
        'Amplio jardín con árboles frutales',
        'Piscina con deck de madera',
        'Quincho con parrilla',
        'Suite principal con jacuzzi',
        'Cuarto de servicio independiente',
        'Garaje para 3 vehículos'
      ],
      area: 320,
      rooms: 5,
      bathrooms: 4,
      floors: 1,
      style: 'Rústico Moderno',
    },
    {
      name: 'Oficina Corporativa',
      description: 'Diseño de espacio de trabajo moderno enfocado en productividad y bienestar del equipo. Incluye áreas colaborativas y espacios privados.',
      category: 'comercial',
      price: 3200,
      currency: 'USD',
      images: ['/placeholder-office-1.jpg'],
      features: [
        'Open space para 20 personas',
        'Sala de reuniones con equipamiento AV',
        'Área de descanso con cocina',
        'Cabinas telefónicas privadas',
        'Recepción con sala de espera',
        'Baños accesibles'
      ],
      area: 250,
      rooms: 8,
      bathrooms: 3,
      floors: 1,
      style: 'Corporativo Moderno',
    },
    {
      name: 'Café Boutique',
      description: 'Local comercial diseñado para cafetería o restaurante pequeño. Ambiente acogedor con diseño funcional para operación eficiente.',
      category: 'comercial',
      price: 1500,
      currency: 'USD',
      images: ['/placeholder-cafe-1.jpg'],
      features: [
        'Barra de servicio con exhibidor',
        'Cocina industrial compacta',
        'Terraza con mobiliario exterior',
        'Iluminación cálida ambiental',
        'Capacidad para 30 comensales',
        'Bodega con acceso independiente'
      ],
      area: 85,
      rooms: 3,
      bathrooms: 2,
      floors: 1,
      style: 'Bohemio Industrial',
    },
    {
      name: 'Casa Eco-Sustentable',
      description: 'Vivienda diseñada con principios de arquitectura sustentable. Incorpora sistemas de energía renovable y materiales ecológicos.',
      category: 'residencial',
      price: 3800,
      currency: 'USD',
      images: ['/placeholder-eco-1.jpg'],
      features: [
        'Paneles solares en techo',
        'Sistema de captación de agua lluvia',
        'Jardín vertical en fachada',
        'Aislamiento térmico natural',
        'Ventilación cruzada pasiva',
        'Huerto urbano en terraza'
      ],
      area: 200,
      rooms: 4,
      bathrooms: 3,
      floors: 2,
      style: 'Eco-Moderno',
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log(`✅ Created ${projects.length} projects`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
