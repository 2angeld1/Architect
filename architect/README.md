# 🏛️ Architect — Ecosistema Digital Full-Stack Premium

¡Bienvenido al repositorio oficial de **Architect**! Este es un sistema web full-stack premium desarrollado con **Next.js** y **Prisma**, diseñado para ofrecer un catálogo interactivo de planos arquitectónicos, reservas de propiedades en tiempo real, gestión dinámica de contenidos (CMS) y testimonios verificados de clientes.

---

## 🚀 Características del Ecosistema

### 👑 Panel de Administración Completo (`/admin`)
* **Gestión de Proyectos:** Carga y edición de planos, precios, áreas, habitaciones, baños, estilos arquitectónicos y carga de imágenes.
* **Interruptor de Destacados:** Sistema con interruptor iOS-style premium que resalta proyectos en la portada principal (`isFeatured`).
* **Testimonios Moderados:** Bandeja de aprobación en tiempo real para testimonios de clientes con filtros de estrellaje automático (4 y 5 estrellas).
* **CMS e Información Dinámica:** Edición directa del número de contacto corporativo en mega menús y pie de página, además de la sección "Nosotros".
* **Categorías Autogestionables:** Soporte inteligente que autoinicializa 6 categorías esenciales de diseño si la base de datos está en blanco.

### 🏠 Experiencia del Cliente (Frontend)
* Catálogo dinámico y filtrable por categorías y características técnicas.
* Formulario abierto y simplificado para el envío de testimonios y valoraciones.
* Sistema interactivo de visualización y cotización de propiedades.

---

## 🛠️ Stack Tecnológico

* **Framework:** [Next.js (App Router)](https://nextjs.org/) (React 19, NodeJS)
* **Base de Datos:** PostgreSQL ([Neon.tech](https://neon.tech/) en producción / Docker en desarrollo local)
* **ORM:** [Prisma Client](https://www.prisma.io/)
* **Media Storage:** [Cloudinary](https://cloudinary.com/) (Almacenamiento y optimización de imágenes)
* **Emails:** [Brevo SMTP](https://www.brevo.com/) (Envío de correos transaccionales)
* **Estilos:** Tailwind CSS y Framer Motion para micro-animaciones premium.

---

## 💻 Desarrollo Local (Paso a Paso)

### 1. Requisitos Previos
Asegúrate de tener instalado:
* **Node.js** (v18 o superior)
* **Docker** (para la base de datos Postgres local)

### 2. Configurar la Base de Datos Local con Docker
Inicia tu contenedor de base de datos local corriendo:
```bash
docker compose up -d
```
*(O utiliza tu base de datos de Postgres preferida en el puerto 5432).*

### 3. Configurar las Variables de Entorno
Crea o edita un archivo `.env` en la raíz del proyecto y define la cadena de conexión local:
```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/architect_db?schema=public"
```

Crea o edita tu archivo `.env.local` para las integraciones de imágenes y correos:
```env
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tu-correo-brevo"
SMTP_PASS="tu-clave-smtp"
SMTP_FROM="tu-remitente-verificado"

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="tu-unsplash-key"
UNSPLASH_SECRET_KEY="tu-unsplash-secret"
```

### 4. Inicializar Prisma y la Base de Datos
Sincroniza el esquema de base de datos de Prisma y ejecuta el semillero de proyectos de muestra:
```bash
# Sincronizar tablas
npx prisma db push

# Poblar base de datos con datos de muestra
npx prisma db seed
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación funcionando.

---

## 🛫 Despliegue en Producción (Vercel + Neon)

Este proyecto está optimizado al 100% para la infraestructura Serverless de **Vercel** y **Neon.tech**.

### 1. Vincular la Base de Datos
1. Ve a la sección **Integrations** en Vercel, selecciona **Neon** y haz clic en **Connect to Project**.
2. Vincula tu base de datos con tu proyecto `architect`. Neon inyectará automáticamente la variable `DATABASE_URL` correspondiente de producción.

### 2. Configurar Variables Adicionales en Vercel
Copia el resto de las variables de tu archivo `.env.local` (Cloudinary, Brevo, Unsplash) en la sección **Settings -> Environment Variables** de tu proyecto en Vercel.

### 3. Ajustar el Comando de Compilación en Vercel
En **Settings -> Build & Development Settings -> Build Command**, activa la personalización y pon:
```bash
npx prisma generate && npx prisma db push && next build
```

---

## 🔒 Registro del Administrador Inicial
Para registrar la primera cuenta de administrador para iniciar sesión en `/admin`:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@correo.com", "password":"tu-contrasena", "name":"Admin Principal"}'
```

---

## 🏛️ ¡Todo listo para crear y diseñar el futuro! ✨
