import type { Project } from '../types';

// Datos de ejemplo para desarrollo con imágenes reales de Unsplash
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Casa Moderna Minimalista',
    description: 'Diseño contemporáneo con líneas limpias y espacios abiertos. Perfecta para familias que buscan un estilo de vida moderno con amplias áreas sociales y conexión con la naturaleza.',
    category: 'residencial',
    price: 2500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Diseño de concepto abierto',
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
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Apartamento Urbano Loft',
    description: 'Espacio tipo loft ideal para profesionales urbanos. Diseño industrial con acabados contemporáneos y máximo aprovechamiento del espacio vertical.',
    category: 'residencial',
    price: 1800,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
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
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Villa Campestre',
    description: 'Residencia de campo con arquitectura tradicional renovada. Ideal para quienes buscan escapar de la ciudad sin perder las comodidades modernas.',
    category: 'residencial',
    price: 4500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1200&q=80'
    ],
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
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  },
  {
    id: '4',
    name: 'Oficina Corporativa',
    description: 'Diseño de espacio de trabajo moderno enfocado en productividad y bienestar del equipo. Incluye áreas colaborativas y espacios privados.',
    category: 'comercial',
    price: 3200,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80'
    ],
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
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z'
  },
  {
    id: '5',
    name: 'Café Boutique',
    description: 'Local comercial diseñado para cafetería o restaurante pequeño. Ambiente acogedor con diseño funcional para operación eficiente.',
    category: 'comercial',
    price: 1500,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559925393-8be0ec41b50d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80'
    ],
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
    createdAt: '2024-05-12T00:00:00Z',
    updatedAt: '2024-05-12T00:00:00Z'
  },
  {
    id: '6',
    name: 'Casa Eco-Sustentable',
    description: 'Vivienda diseñada con principios de arquitectura sustentable. Incorpora sistemas de energía renovable y materiales ecológicos.',
    category: 'residencial',
    price: 3800,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1518005020480-1097c00975e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bdb74axm-uY?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fee74a52?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
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
    createdAt: '2024-06-18T00:00:00Z',
    updatedAt: '2024-06-18T00:00:00Z'
  }
];
