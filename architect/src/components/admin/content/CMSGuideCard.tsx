import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function CMSGuideCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-zinc-900 to-zinc-900/40 hover:bg-zinc-800/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white tracking-wide">¿Cómo funciona el Gestor de Contenidos (CMS)?</h3>
            <p className="text-xs text-zinc-500 mt-0.5 font-light">Guía rápida paso a paso para editar tu página</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
      </button>

      {isOpen && (
        <div className="p-6 border-t border-zinc-800/50 bg-zinc-950/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold font-mono border border-blue-500/30">1</span>
                <h4 className="text-sm font-medium text-white">Selecciona la Página</h4>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed pl-9">
                Usa las pestañas de arriba (Home, Nosotros, etc.) para ver los textos e imágenes que pertenecen a esa sección específica de tu sitio web.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/30">2</span>
                <h4 className="text-sm font-medium text-white">Edita el Contenido</h4>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed pl-9">
                Identifica el bloque que quieres cambiar (ej. "Título Principal"), haz clic en el botón <span className="text-zinc-300 font-medium border border-zinc-700 px-1 py-0.5 rounded bg-zinc-800">Editar</span> y modifica el texto o pega la URL de tu nueva imagen.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold font-mono border border-purple-500/30">3</span>
                <h4 className="text-sm font-medium text-white">Guarda y Publica</h4>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed pl-9">
                Al darle a <span className="text-zinc-300 font-medium border border-zinc-700 px-1 py-0.5 rounded bg-zinc-800">Guardar Cambios</span>, tu sitio web se actualizará automáticamente en tiempo real gracias a nuestro motor sincronizado. ¡Así de simple!
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 leading-relaxed">
            <strong className="text-white font-medium">💡 Tip avanzado:</strong> Si no encuentras un texto que quieres cambiar, puedes usar el botón superior "Añadir Elemento" para registrar una nueva variable. Asegúrate de que el <span className="font-mono text-xs bg-zinc-800 px-1 py-0.5 rounded text-zinc-300 border border-zinc-700">Identificador (Key)</span> coincida exactamente con el que está programado en tu página web frontal. Para modificar imágenes, te recomendamos subirlas primero en la pestaña "Archivos Media" y pegar la URL aquí.
          </div>
        </div>
      )}
    </div>
  );
}
