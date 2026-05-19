'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity, CalendarDays, FolderKanban } from 'lucide-react';

const stats = [
  { title: 'Proyectos Activos', value: '12', change: '+2', trend: 'up', icon: FolderKanban },
  { title: 'Ingresos (Mes)', value: '$45,200', change: '+12.5%', trend: 'up', icon: Activity },
  { title: 'Nuevas Cotizaciones', value: '8', change: '-1', trend: 'down', icon: CalendarDays },
];

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            key={stat.title} 
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group"
          >
            {/* Subtle glow effect */}
            <div className="absolute -inset-x-20 -top-20 h-40 w-full bg-gradient-to-b from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-light text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-xl">
                <stat.icon className="w-5 h-5 text-zinc-300" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </span>
              <span className="text-zinc-500 text-xs">vs mes anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart / Main Panel Placeholder */}
        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 h-96 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Rendimiento Financiero</h3>
          <div className="flex-1 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center">
            <p className="text-zinc-500 text-sm">El gráfico de Recharts irá aquí</p>
          </div>
        </div>

        {/* Side Panel Placeholder */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Actividad Reciente</h3>
          <div className="flex-1 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-zinc-700" />
                <div>
                  <p className="text-sm text-zinc-300">Cotización #RES-X92 confirmada</p>
                  <p className="text-xs text-zinc-500">Hace {i * 2} horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
