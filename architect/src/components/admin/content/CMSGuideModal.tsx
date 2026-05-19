'use client';

import { useState } from 'react';
import { X, Info, Check, AlertOctagon, HelpCircle, FileText, ArrowRight, Image, Type } from 'lucide-react';

interface CMSGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'pasos' | 'formatos' | 'permitido' | 'prohibido' | 'ejemplos';

export default function CMSGuideModal({ isOpen, onClose }: CMSGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pasos');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white tracking-wide">Manual del Gestor de Contenido (CMS)</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Entiende al 100% cómo actualizar tu sitio web sin tocar código</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Shorter/Compact tab labels to prevent overflow */}
        <div className="flex flex-wrap items-center border-b border-zinc-800/60 bg-zinc-900/50 p-3 gap-2">
          <button
            onClick={() => setActiveTab('pasos')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'pasos' 
                ? 'bg-zinc-850 text-white shadow-sm border border-zinc-750' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
            }`}
          >
            📋 Paso a Paso
          </button>
          <button
            onClick={() => setActiveTab('formatos')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'formatos' 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
            }`}
          >
            🔤 Formatos
          </button>
          <button
            onClick={() => setActiveTab('permitido')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'permitido' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
            }`}
          >
            ✅ Permitido
          </button>
          <button
            onClick={() => setActiveTab('prohibido')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'prohibido' 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
            }`}
          >
            🚫 Prohibido
          </button>
          <button
            onClick={() => setActiveTab('ejemplos')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'ejemplos' 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
            }`}
          >
            💡 Ejemplos
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-zinc-300 leading-relaxed bg-zinc-950/20">
          
          {/* TAB 1: PASO A PASO */}
          {activeTab === 'pasos' && (
            <div className="space-y-6">
              <h4 className="text-white font-medium text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                Guía Paso a Paso Completa
              </h4>
              
              <div className="relative pl-8 border-l border-zinc-800 space-y-8">
                {/* Paso 1 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold font-mono border border-blue-500/30 shadow-md">1</div>
                  <h5 className="text-white font-semibold text-sm">Selecciona la Sección a Modificar</h5>
                  <p className="text-zinc-400 mt-1">
                    En la barra de pestañas principal, selecciona la sección que quieres actualizar (ej. <span className="text-white">Home</span> para la portada, <span className="text-white">Nosotros</span> para la historia). Las tarjetas se filtrarán automáticamente.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold font-mono border border-blue-500/30 shadow-md">2</div>
                  <h5 className="text-white font-semibold text-sm">Identifica el Bloque Específico</h5>
                  <p className="text-zinc-400 mt-1">
                    Cada tarjeta representa una pieza de texto o imagen exacta en tu sitio web. Observa los campos:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-zinc-450 space-y-1">
                    <li><span className="text-zinc-300 font-medium">Sección (Section):</span> La parte visual a la que corresponde (ej. <code className="font-mono text-xs bg-zinc-850 px-1 py-0.5 rounded text-zinc-300 border border-zinc-750">hero</code>, <code className="font-mono text-xs bg-zinc-850 px-1 py-0.5 rounded text-zinc-300 border border-zinc-750">features</code>).</li>
                    <li><span className="text-zinc-300 font-medium">Clave (Key):</span> El identificador del código (ej. <code className="font-mono text-xs bg-zinc-850 px-1 py-0.5 rounded text-zinc-300 border border-zinc-750">main_title</code>).</li>
                    <li><span className="text-zinc-300 font-medium">Tipo:</span> Puede ser Texto, Imagen, o Texto Enriquecido.</li>
                  </ul>
                </div>

                {/* Paso 3 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold font-mono border border-blue-500/30 shadow-md">3</div>
                  <h5 className="text-white font-semibold text-sm">Abre el Cajón de Edición</h5>
                  <p className="text-zinc-400 mt-1">
                    Haz clic en el botón <span className="text-white font-medium bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded">Editar</span>. Se abrirá un panel lateral. Cambia el contenido en el editor visual.
                  </p>
                </div>

                {/* Paso 4 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold font-mono border border-blue-500/30 shadow-md">4</div>
                  <h5 className="text-white font-semibold text-sm">Guarda los Cambios</h5>
                  <p className="text-zinc-400 mt-1">
                    Haz clic en el botón verde <span className="text-emerald-400 font-semibold">Guarda Cambios</span>. React Query actualizará inmediatamente la base de datos y limpiará la memoria caché de la web pública, por lo que tus clientes verán los cambios al instante.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FORMATOS DE ENTRADA (2-column layout to make it very wide and spacious) */}
          {activeTab === 'formatos' && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-white font-medium text-base flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Type className="w-5 h-5 text-blue-400" />
                ¿Cómo rellenar cada Tipo de Contenido?
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* Left Column: Short Text & Image */}
                <div className="space-y-6">
                  
                  {/* 1. Texto Corto */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      1. Texto Corto (Línea Única)
                    </div>
                    <p className="text-zinc-400 text-xs pl-4 leading-relaxed">
                      Ideal para <span className="text-zinc-200 font-medium">Títulos, Subtítulos cortos, Insignias (Badges) o Botones</span>. 
                    </p>
                    <div className="pl-4 mt-2">
                      <span className="text-xs text-zinc-500 uppercase block mb-1">Ejemplo de uso:</span>
                      <code className="font-mono text-xs bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 block">
                        Entrega Inmediata
                      </code>
                    </div>
                    <p className="text-zinc-500 text-[11px] pl-4 italic">
                      ⚠️ Importante: No insertes saltos de línea (no presiones Enter) para evitar descuadres estéticos.
                    </p>
                  </div>

                  {/* 3. Imagen */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      3. Imagen (Banners, Logos, Fondos)
                    </div>
                    <p className="text-zinc-400 text-xs pl-4 leading-relaxed">
                      Representa un archivo gráfico alojado en la nube. Debe ser un enlace completo que empiece con <code className="text-zinc-200">https://</code>.
                    </p>
                    <div className="pl-4 mt-2">
                      <span className="text-xs text-zinc-500 uppercase block mb-1">Ejemplo de uso:</span>
                      <code className="font-mono text-xs bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-emerald-400 block break-all">
                        https://res.cloudinary.com/demo/image/upload/v1600000000/architect-home-banner.jpg
                      </code>
                    </div>
                    <p className="text-zinc-500 text-[11px] pl-4 italic">
                      💡 Tip: Sube tus fotos en la sección "Archivos Media" (menú lateral), cópiales la URL y pégala aquí de forma segura.
                    </p>
                  </div>

                </div>

                {/* Right Column: Long Paragraph (which needs lots of vertical space) */}
                <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    2. Párrafo Largo (Descripciones, Textos largos y Listas)
                  </div>
                  <p className="text-zinc-400 text-xs pl-4 leading-relaxed">
                    Utilizado para explicaciones extensas, listas o bloques de texto múltiples. El sistema acepta 3 formas de estructurarlo:
                  </p>
                  
                  {/* Formas */}
                  <div className="pl-4 space-y-4">
                    {/* Forma A */}
                    <div className="bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-850/60 space-y-1">
                      <span className="text-xs font-semibold text-purple-300 uppercase block">Forma A: Texto Plano Simple</span>
                      <p className="text-zinc-400 text-xs">Escribe tu texto con saltos de línea normales. Úsalo si solo quieres separar párrafos simples.</p>
                      <code className="font-mono text-xs bg-zinc-950 px-3 py-2 rounded border border-zinc-800 text-zinc-400 block whitespace-pre-line mt-2">
                        {"Diseñamos propiedades exclusivas listas para habitar.\n\nNuestras viviendas cuentan con acabados premium y diseño bioclimático."}
                      </code>
                    </div>

                    {/* Forma B */}
                    <div className="bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-850/60 space-y-1">
                      <span className="text-xs font-semibold text-purple-300 uppercase block">Forma B: HTML Básico</span>
                      <p className="text-zinc-400 text-xs">Usa etiquetas HTML seguras como <code className="text-white">&lt;br/&gt;</code> para forzar un salto o <code className="text-white">&lt;strong&gt;</code> para negritas.</p>
                      <code className="font-mono text-xs bg-zinc-950 px-3 py-2 rounded border border-zinc-800 text-zinc-400 block mt-2">
                        Diseñamos propiedades &lt;strong&gt;exclusivas&lt;/strong&gt;.&lt;br/&gt;Listas para habitar hoy.
                      </code>
                    </div>

                    {/* Forma C */}
                    <div className="bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-850/60 space-y-2">
                      <span className="text-xs font-semibold text-purple-300 uppercase block">Forma C: Formato JSON (Múltiples Párrafos)</span>
                      <p className="text-zinc-400 text-xs">
                        Si el componente frontal procesa párrafos independientes o columnas, debes ingresar un <span className="text-zinc-200 font-medium">Array JSON válido</span>.
                      </p>
                      <code className="font-mono text-xs bg-zinc-950 px-3 py-2.5 rounded border border-zinc-800 text-emerald-400 block whitespace-pre-wrap">
                        {`[
  "Diseñamos propiedades exclusivas con altos estándares de calidad.",
  "Nuestras viviendas cuentan con acabados premium.",
  "Incluye automatización de luces inteligentes."
]`}
                      </code>
                      <p className="text-zinc-500 text-[11px] italic">
                        ⚠️ Regla: Usa comillas rectas dobles <code className="text-zinc-300">"</code>. Las comillas curvas harán que falle.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: QUÉ SE PUEDE HACER */}
          {activeTab === 'permitido' && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-white font-medium text-base flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Check className="w-5 h-5 text-emerald-400" />
                Características y Acciones Permitidas
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Modificar Textos
                  </div>
                  <p className="text-zinc-450 text-xs leading-relaxed">
                    Puedes cambiar cualquier título, descripción, eslogan, pie de página o texto largo.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Image className="w-4 h-4 text-emerald-400" />
                    Cambiar Imágenes
                  </div>
                  <p className="text-zinc-450 text-xs leading-relaxed">
                    Puedes actualizar logotipos, imágenes de fondo y banners. Copia la URL de cualquier imagen subida en la sección de "Medios" y pégala aquí.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    Añadir Nuevas Claves
                  </div>
                  <p className="text-zinc-450 text-xs leading-relaxed">
                    Si eres desarrollador, puedes hacer clic en <span className="text-zinc-300">Añadir Elemento</span> para crear una nueva clave y vincularla a un nuevo texto dinámico en tu web.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Info className="w-4 h-4 text-emerald-400" />
                    Edición con Texto Enriquecido (HTML)
                  </div>
                  <p className="text-zinc-450 text-xs leading-relaxed">
                    Admite pequeños tags de estilo HTML como <code className="text-zinc-300">&lt;br/&gt;</code> para saltos de línea o <code className="text-zinc-300">&lt;strong&gt;</code> para resaltar palabras clave.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUÉ NO SE PUEDE HACER */}
          {activeTab === 'prohibido' && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-white font-medium text-base flex items-center gap-2 border-b border-zinc-800 pb-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                Reglas Críticas & Limitaciones
              </h4>

              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-4">
                <div className="space-y-2">
                  <h5 className="text-red-400 font-semibold text-sm">❌ NO alteres o elimines variables del sistema</h5>
                  <p className="text-zinc-400 text-xs">
                    Las claves dinámicas como <code className="font-mono text-xs bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850 text-zinc-300">hero.title</code> o <code className="font-mono text-xs bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850 text-zinc-300">global.phone</code> están vinculadas directamente al código del front-end. Si eliminas una o le cambias el nombre a la Clave (Key), esa parte del sitio web se quedará en blanco o fallará al renderizar.
                  </p>
                </div>

                <div className="space-y-2 border-t border-zinc-800/80 pt-4">
                  <h5 className="text-red-400 font-semibold text-sm">❌ NO uses archivos locales directamente en el CMS</h5>
                  <p className="text-zinc-400 text-xs">
                    El CMS no acepta archivos arrastrados en sus cajas de texto. Si quieres usar una imagen nueva, primero debes subirla en la pestaña <span className="text-zinc-300 font-medium">Medios / Biblioteca de Medios</span>, copiar su URL pública y pegar esa URL en el valor de la tarjeta del CMS.
                  </p>
                </div>

                <div className="space-y-2 border-t border-zinc-800/80 pt-4">
                  <h5 className="text-red-400 font-semibold text-sm">❌ NO rompas la estructura HTML o JSON</h5>
                  <p className="text-zinc-400 text-xs">
                    Si modificas un array en formato JSON, asegúrate de no omitir comas ni borrar los corchetes de cierre, ya que un formato roto puede desestructurar toda la visualización de la web para tus clientes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EJEMPLOS Y CASOS */}
          {activeTab === 'ejemplos' && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-white font-medium text-base flex items-center gap-2 border-b border-zinc-800 pb-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Ejemplos de Casos de Uso del CMS
              </h4>

              <div className="space-y-4">
                {/* Caso 1 */}
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                  <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">Caso de Uso A: Cambiar el teléfono general de la empresa</div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    1. Entra a la pestaña <span className="text-white">global</span>.<br/>
                    2. Ubica la tarjeta con la clave <code className="font-mono text-[11px] bg-zinc-850 px-1 py-0.5 rounded text-zinc-300">phone</code>.<br/>
                    3. Haz clic en <span className="text-white">Editar</span> y escribe el nuevo número: <code className="text-emerald-400 font-mono">+34 600 000 000</code>.<br/>
                    4. Guarda. El teléfono se actualizará inmediatamente en el encabezado y el pie de página de toda la web.
                  </p>
                </div>

                {/* Caso 2 */}
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                  <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">Caso de Uso B: Cambiar el Banner Principal de la Portada</div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    1. Ve a "Biblioteca de Medios" en el menú de la izquierda y sube la nueva imagen espectacular en alta calidad.<br/>
                    2. Haz clic en "Copiar URL" de la imagen en tu galería de medios.<br/>
                    3. Regresa al Gestor de Contenidos, ve a la pestaña <span className="text-white">home</span>.<br/>
                    4. Encuentra la tarjeta con tipo <span className="text-zinc-300 font-medium">image</span> y clave <code className="font-mono text-[11px] bg-zinc-850 px-1 py-0.5 rounded text-zinc-300">hero.image_url</code>.<br/>
                    5. Edítala, borra el enlace viejo, pega el nuevo enlace copiado y dale a Guardar. ¡Listo!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end bg-zinc-900/40">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-zinc-950 bg-white hover:bg-zinc-100 transition-all text-sm font-sans"
          >
            Entendido, ¡gracias!
          </button>
        </div>

      </div>
    </div>
  );
}
