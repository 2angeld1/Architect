'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Instagram, 
  Facebook, 
  Loader2, 
  Check, 
  AlertCircle,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Perfil Admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Variables Globales
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (response.ok) {
        setAdminName(data.user.name || '');
        setAdminEmail(data.user.email || '');
        
        // Cargar configs globales
        setContactEmail(data.settings.contact_email || '');
        setContactPhone(data.settings.contact_phone || '');
        setOfficeAddress(data.settings.contact_address || '');
        setInstagramUrl(data.settings.social_instagram || '');
        setFacebookUrl(data.settings.social_facebook || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('Las nuevas contraseñas no coinciden');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminName,
          currentPassword,
          newPassword,
          contactEmail,
          contactPhone,
          officeAddress,
          instagramUrl,
          facebookUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar las configuraciones.');
      }

      setSuccess('¡Configuraciones guardadas y actualizadas con éxito!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <p className="text-sm font-light">Cargando configuraciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Page Header */}
      <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-zinc-100">Configuración</h2>
          <p className="text-zinc-500 text-sm mt-1">Administra tu perfil, variables del sistema y configuraciones globales.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & Password */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Admin Account Section */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-light text-zinc-100 flex items-center gap-2 pb-3 border-b border-zinc-900">
              <User className="w-5 h-5 text-zinc-400" />
              <span>Perfil de Administrador</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-750 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  disabled
                  value={adminEmail}
                  className="w-full px-4 py-3 bg-zinc-900/10 border border-zinc-900 rounded-xl text-sm text-zinc-500 cursor-not-allowed"
                />
                <span className="block text-[10px] text-zinc-600 font-light">El correo electrónico no puede cambiarse.</span>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-6 space-y-6">
              <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-500" />
                <span>Cambiar Contraseña (Opcional)</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Confirmar Nueva
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-light text-zinc-100 flex items-center gap-2 pb-3 border-b border-zinc-900">
              <Mail className="w-5 h-5 text-zinc-400" />
              <span>Información Global de Contacto</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email Público de Contacto
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-650">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="hola@architect.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Teléfono de Oficina
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-650">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="+507 6000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Dirección Física de la Oficina
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-650">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="Ciudad del Saber, Edif. 230, Panamá"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Social Media & Brevo SMTP details */}
        <div className="space-y-8">
          
          {/* Social Media Links */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-light text-zinc-100 flex items-center gap-2 pb-3 border-b border-zinc-900">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span>Redes Sociales</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Enlace de Instagram
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-650">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="https://instagram.com/architect"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Enlace de Facebook
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-650">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-800"
                    placeholder="https://facebook.com/architect"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brevo SMTP Connection Details */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Conexión de Notificación (Brevo)</span>
            </div>
            
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              El portal está conectado exitosamente al servicio de retransmisión SMTP de **Brevo** para el envío de notificaciones de cotización, compras y recuperación de contraseña.
            </p>

            <div className="border-t border-zinc-900 pt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-900/50">
                <span className="text-zinc-500">Servidor SMTP:</span>
                <span className="text-zinc-300 font-mono">smtp-relay.brevo.com</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900/50">
                <span className="text-zinc-500">Puerto SMTP:</span>
                <span className="text-zinc-300 font-mono">2525</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900/50">
                <span className="text-zinc-500">Email Emisor:</span>
                <span className="text-zinc-300 font-mono">adfp21900@gmail.com</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Estado SMTP:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Activo
                </span>
              </div>
            </div>
          </div>

          {/* Submit Actions Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-transparent text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <>
                  <Send className="w-4 h-4 text-zinc-950" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
