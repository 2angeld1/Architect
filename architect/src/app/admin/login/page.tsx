'use client';

import Link from 'next/link';
import { Hexagon, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLogin } from '@/hooks/admin/useLogin';
import { slideUp, scaleUp } from '@/animations/variants';

export default function LoginPage() {
  const { email, setEmail, password, setPassword, showPassword, setShowPassword, loading, error, success, handleSubmit, } = useLogin();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-zinc-800 selection:text-white">

      {/* Brand Header */}
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        {/* Brand Logo */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-white/10 mb-6 border border-zinc-200/10">
          <Hexagon className="w-6 h-6 text-zinc-955 fill-zinc-955 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extralight tracking-widest text-zinc-100 uppercase">
          ARCHI<span className="font-bold">TECT</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">
          Portal de Administración
        </p>
      </motion.div>

      {/* Form Container */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Glassmorphic Form Card */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          className="bg-zinc-950/40 backdrop-blur-2xl border border-zinc-900/80 shadow-2xl shadow-black/80 rounded-2xl px-6 py-8 sm:px-10"
        >
          <h3 className="text-xl font-light text-zinc-100 mb-6">Iniciar Sesión</h3>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
                  placeholder="admin@architect.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Contraseña
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-transparent text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-955" />
              ) : (
                <>
                  <span>Ingresar al Panel</span>
                  <ArrowRight className="w-4 h-4 text-zinc-955" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center border-t border-zinc-900/80 pt-6">
            <span className="text-xs text-zinc-500">¿No tienes cuenta de administrador? </span>
            <Link
              href="/admin/register"
              className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors duration-200"
            >
              Regístrate aquí
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
