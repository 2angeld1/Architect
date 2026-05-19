import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface UserSession {
  id: string;
  email: string;
  name: string | null;
}

export const useTopNav = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch logged-in user details using React Query
  const { data: user = null, isLoading } = useQuery<UserSession | null>({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.authenticated ? data.user : null;
    },
  });

  // Logout mutation
  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      window.location.href = '/admin/login';
    },
    onError: (error) => {
      console.error('Logout error:', error);
    }
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format the title based on route
  const getTitle = () => {
    if (pathname === '/admin') return 'Resumen General';
    if (pathname.includes('/projects')) return 'Gestión de Proyectos';
    if (pathname.includes('/reservations')) return 'Cotizaciones y Pagos';
    if (pathname.includes('/clients')) return 'Directorio de Clientes';
    if (pathname.includes('/settings')) return 'Configuración';
    return 'Panel de Administración';
  };

  // Get initials from user name
  const getInitials = () => {
    if (!user || !user.name) return 'AD';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return {
    user,
    isLoading,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    getTitle,
    getInitials,
    handleLogout: () => handleLogout(),
  };
};
