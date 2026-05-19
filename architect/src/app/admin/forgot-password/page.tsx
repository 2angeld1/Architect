'use client';

import Link from 'next/link';
import { Hexagon, Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForgotPassword } from '@/hooks/admin/useForgotPassword';
import { slideUp, scaleUp } from '@/animations/variants';

export default function ForgotPasswordPage() {
  const {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
  } = useForgotPassword();

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
          <Hexagon className="w-6 h-6 text-zinc-955 fill-zinc-955" />
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
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/login"
              className="text-zinc-500 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h3 className="text-xl font-light text-zinc-100">Recuperar Contraseña</h3>
          </div>
          
          <p className="text-sm text-zinc-400 font-light mb-6 leading-relaxed">
            Introduce tu dirección de correo electrónico registrado. Te enviaremos un enlace seguro para restablecer tu contraseña a través de **Brevo SMTP**.
          </p>

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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 focus:bg-zinc-900 transition-all duration-200"
                  placeholder="admin@architect.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-transparent text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <>
                  <span>Enviar Correo</span>
                  <ArrowRight className="w-4 h-4 text-zinc-950" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
