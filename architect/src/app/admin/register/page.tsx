'use client';

import Link from 'next/link';
import { Hexagon, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRegister } from '@/hooks/admin/useRegister';
import { slideUp, scaleUp } from '@/animations/variants';

export default function RegisterPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-zinc-800 selection:text-white">
      <motion.div 
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        {/* Brand Logo */}
        <motion.div 
          variants={scaleUp}
          className="mx-auto w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-white/10 mb-6 border border-zinc-200/10"
        >
          <Hexagon className="w-6 h-6 text-zinc-955 fill-zinc-955" />
        </motion.div>
        <h2 className="text-3xl font-extralight tracking-widest text-zinc-100 uppercase">
          ARCHI<span className="font-bold">TECT</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">
          Portal de Administración
        </p>
      </motion.div>

      <motion.div 
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0"
      >
        {/* Glassmorphic Form Card */}
        <div className="bg-zinc-950/40 backdrop-blur-2xl border border-zinc-900/80 shadow-2xl shadow-black/80 rounded-2xl px-6 py-8 sm:px-10">
          <h3 className="text-xl font-light text-zinc-100 mb-6">Registrar Administrador</h3>
          
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Nombre Completo
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
                  placeholder="admin@architect.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Confirmar Contraseña
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
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-655 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-transparent text-sm font-semibold text-zinc-955 bg-white hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98] mt-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-955" />
              ) : (
                <>
                  <span>Registrar Cuenta</span>
                  <ArrowRight className="w-4 h-4 text-zinc-955" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center border-t border-zinc-900/80 pt-6">
            <span className="text-xs text-zinc-500">¿Ya tienes cuenta? </span>
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors duration-200"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
