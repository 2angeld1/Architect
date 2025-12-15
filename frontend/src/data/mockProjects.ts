import type { Project } from '../types';

// Datos de ejemplo para desarrollo - esto vendrá del backend
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Casa Moderna Minimalista',
    description: 'Diseño contemporáneo con líneas limpias y espacios abiertos. Perfecta para familias que buscan un estilo de vida moderno con amplias áreas sociales y conexión con la naturaleza.',
    category: 'residencial',
    price: 2500,
    currency: 'USD',
    images: ['/placeholder-house-1.jpg'],
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
    createdAt: '2024-06-18T00:00:00Z',
    updatedAt: '2024-06-18T00:00:00Z'
  }
];
