import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('admin_session')?.value;

  // Rutas de autenticación pública para el admin
  const isAuthPage = 
    pathname.startsWith('/admin/login') || 
    pathname.startsWith('/admin/register') || 
    pathname.startsWith('/admin/forgot-password') || 
    pathname.startsWith('/admin/reset-password');

  // Solo aplicar proxy a rutas que inicien con /admin
  if (pathname.startsWith('/admin')) {
    // Si no está logueado y no está en una página de autenticación, redirigir al login
    if (!sessionToken && !isAuthPage) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Si ya está logueado e intenta acceder al login/registro, redirigir al panel
    if (sessionToken && isAuthPage) {
      const adminDashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminDashboardUrl);
    }
  }

  return NextResponse.next();
}

// Para compatibilidad máxima con las convenciones de Next.js 16+
export default proxy;

// Configurar los paths en los que se ejecutará el proxy
export const config = {
  matcher: ['/admin/:path*'],
};
