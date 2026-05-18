'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CalendarDays, 
  Users, 
  Settings,
  LogOut,
  Hexagon,
  Globe,
  FolderOpen,
  Compass,
  Images
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumen', href: '/admin' },
  { icon: FolderKanban, label: 'Proyectos', href: '/admin/projects' },
  { icon: FolderOpen, label: 'Categorías', href: '/admin/categories' },
  { icon: Compass, label: 'Navegación', href: '/admin/menus' },
  { icon: Images, label: 'Galería', href: '/admin/media' },
  { icon: CalendarDays, label: 'Reservas', href: '/admin/reservations' },
  { icon: Users, label: 'Clientes', href: '/admin/clients' },
  { icon: LayoutDashboard, label: 'Contenido (CMS)', href: '/admin/content' },
  { icon: Settings, label: 'Configuración', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between sticky top-0 z-50">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-lg shadow-black/40">
            <Hexagon className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider text-zinc-100 font-heading leading-tight">
              ARCHI<span className="text-zinc-400">TECT</span>
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            
            return (
              <Link key={item.href} href={item.href} className="block">
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative font-medium text-sm",
                  isActive 
                    ? "bg-zinc-900 text-white border border-zinc-800" 
                    : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                )}>
                  {/* Elegant left indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-full" />
                  )}
                  
                  <item.icon className={clsx(
                    "w-4 h-4 shrink-0 transition-transform duration-200",
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300 group-hover:scale-105"
                  )} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-zinc-900 space-y-2">
        <Link href="/" className="block">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300 transition-all duration-200">
            <Globe className="w-4 h-4 shrink-0" />
            <span>Ver sitio público</span>
          </div>
        </Link>

        <button className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group">
          <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
