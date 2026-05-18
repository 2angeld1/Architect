'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Hexagon, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!token) {
      setError('El token de restablecimiento falta o no es válido.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Hubo un error al restablecer la contraseña.');
      }

      setSuccess('¡Contraseña restablecida con éxito!');
    } catch (err: any) {
      setError(err.message || 'Error de procesamiento');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-medium text-zinc-100 mb-2">¡Todo listo!</h4>
        <p className="text-sm text-zinc-400 font-light mb-6">
          Tu contraseña ha sido restablecida con éxito. Ya puedes ingresar al portal administrativo con tu nueva contraseña.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex justify-center items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 transition-all duration-200 active:scale-[0.98]"
        >
          <span>Iniciar Sesión</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!token && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 leading-relaxed">
          ⚠️ No se detectó ningún token de recuperación. Asegúrate de haber hecho clic en el enlace correcto enviado a tu correo.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* New Password */}
      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Nueva Contraseña
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Confirmar Nueva Contraseña
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
            placeholder="••••••••••••"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !token}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-transparent text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98] mt-6"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
        ) : (
          <>
            <span>Actualizar Contraseña</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-zinc-800 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-white/10 mb-6 border border-zinc-200/10">
          <Hexagon className="w-6 h-6 text-zinc-950 fill-zinc-950" />
        </div>
        <h2 className="text-3xl font-extralight tracking-widest text-zinc-100 uppercase">
          ARCHI<span className="font-bold">TECT</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">
          Portal de Administración
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Glassmorphic Form Card */}
        <div className="bg-zinc-950/40 backdrop-blur-2xl border border-zinc-900/80 shadow-2xl shadow-black/80 rounded-2xl px-6 py-8 sm:px-10">
          <h3 className="text-xl font-light text-zinc-100 mb-4">Nueva Contraseña</h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta de administrador.
          </p>

          <Suspense fallback={
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
