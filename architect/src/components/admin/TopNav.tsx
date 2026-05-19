'use client';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTopNav } from '../../hooks/admin/useTopNav';

export default function TopNav() {
  const {
    user,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    getTitle,
    getInitials,
    handleLogout,
  } = useTopNav();

  return (
    <header className="h-24 w-full bg-zinc-950/40 backdrop-blur-md border-b border-zinc-900 flex items-center justify-between px-10 sticky top-0 z-40">
      <div>
        <h1 className="text-2xl font-light text-zinc-100 tracking-wide font-heading">
          {getTitle()}
        </h1>
        <p className="text-xs text-zinc-500 mt-1 font-medium">
          {user ? `Bienvenido de vuelta, ${user.name || 'Administrador'}.` : 'Cargando sesión...'}
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-zinc-300 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-zinc-900/40 border border-zinc-800/80 text-zinc-200 text-sm rounded-full focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 block w-64 pl-10 p-2.5 outline-none transition-all duration-300 placeholder-zinc-600"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-full bg-zinc-900/40 border border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-zinc-100 rounded-full animate-pulse"></span>
        </button>

        {/* User Profile Trigger & Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          {/* Avatar Button */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 w-10 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden cursor-pointer shadow-lg active:scale-95 hover:border-zinc-700 transition-all duration-200"
          >
            <span className="text-xs font-bold text-zinc-300 tracking-wider">
              {getInitials()}
            </span>
          </button>

          {/* Glassmorphic Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-zinc-950/95 border border-zinc-900 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
              {/* User Header Details */}
              <div className="px-4 py-3 border-b border-zinc-900 text-left">
                <p className="text-xs font-semibold text-zinc-200 truncate">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {user?.email || 'cargando...'}
                </p>
              </div>

              {/* Actions List */}
              <div className="py-1">
                <Link href="/admin/settings" onClick={() => setIsDropdownOpen(false)}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-all duration-200">
                    <User className="w-3.5 h-3.5" />
                    <span>Mi Perfil</span>
                  </div>
                </Link>

                <Link href="/admin/settings" onClick={() => setIsDropdownOpen(false)}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-all duration-200">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configuración</span>
                  </div>
                </Link>
              </div>

              {/* Logout button */}
              <div className="border-t border-zinc-900 pt-1 pb-1">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 w-full rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
