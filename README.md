# Archiquect - E-commerce de Planos Arquitectónicos

Sistema de reservas y compra de planos arquitectónicos desarrollado con React, Node.js y PostgreSQL.

## 📁 Estructura del Proyecto

```
Archiquect/
├── frontend/          # React + Vite + Tailwind + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── checkout/  # Componentes del flujo de checkout
│   │   │   └── layout/    # Header, Footer, Layout
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── store/         # Estado global con Zustand
│   │   ├── services/      # Servicios de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── data/          # Datos mock para desarrollo
│   └── ...
│
└── backend/           # Node.js + Express + Prisma + PostgreSQL
    ├── src/
    │   ├── routes/        # Rutas de la API
    │   ├── middleware/    # Middleware personalizado
    │   └── lib/           # Configuración de Prisma
    └── prisma/
        ├── schema.prisma  # Esquema de base de datos
        └── seed.ts        # Datos de prueba
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o pnpm

### 1. Configurar la Base de Datos

```bash
# Crear la base de datos en PostgreSQL
createdb archiquect
```

### 2. Configurar el Backend

```bash
cd backend

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tu configuración de PostgreSQL
# DATABASE_URL="postgresql://usuario:password@localhost:5432/archiquect?schema=public"

# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:push

# Sembrar datos de prueba
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:4000`

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📋 Flujo de Reserva

El sistema implementa un flujo de checkout de 4 pasos:

1. **Selección de Proyecto** - El usuario elige un proyecto arquitectónico
2. **Información del Comprador** - Formulario con datos personales y dirección
3. **Información de Pago** - Selección de método de pago (tarjeta, transferencia, cotización)
4. **Revisión** - Resumen completo antes de confirmar

### Tipos de Reserva

- **Compra Directa**: El usuario compra un plano existente
- **Cotización**: El usuario solicita una cotización personalizada

## 🛠️ Stack Tecnológico

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Zustand (estado global)
- Axios
- Lucide React (iconos)

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Express Validator
- Stripe (integración pendiente)

## 📡 API Endpoints

### Proyectos
- `GET /api/projects` - Listar todos los proyectos
- `GET /api/projects/:id` - Obtener proyecto por ID
- `GET /api/projects/category/:category` - Filtrar por categoría

### Checkout
- `POST /api/checkout` - Procesar reserva
- `POST /api/checkout/validate` - Validar datos
- `GET /api/checkout/summary/:projectId` - Obtener resumen

### Reservas
- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/:id` - Obtener reserva por ID
- `GET /api/reservations/number/:number` - Buscar por número
- `PATCH /api/reservations/:id/status` - Actualizar estado

## 🔒 Próximos Pasos

- [ ] Integración completa con Stripe para pagos
- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Envío de emails transaccionales
- [ ] Descarga de archivos tras confirmación de pago
- [ ] Sistema de reviews y calificaciones

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.
