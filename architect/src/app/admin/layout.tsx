'use client';

import Sidebar from '@/components/admin/Sidebar';
import TopNav from '@/components/admin/TopNav';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Verificar si es una ruta de autenticación del admin
  const isAuthPage = 
    pathname.startsWith('/admin/login') || 
    pathname.startsWith('/admin/register') || 
    pathname.startsWith('/admin/forgot-password') || 
    pathname.startsWith('/admin/reset-password');

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans selection:bg-zinc-800 selection:text-white">
      {/* Premium Glass Sidebar */}
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
          <div className="p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
