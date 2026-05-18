'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  currentImage?: string | null;
}

export default function CloudinaryUploader({ onUpload, onRemove, label = 'Subir Imagen', currentImage }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Send to our API
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64String }),
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to upload');
        
        onUpload(data.url);
      };
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>
      
      {currentImage && !isUploading ? (
        <div className="relative rounded-xl overflow-hidden border border-zinc-800 group h-48 bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity"
          />
          <button 
            type="button"
            onClick={onRemove}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="bg-red-500/80 text-white p-3 rounded-full">
              <X className="w-5 h-5" />
            </div>
          </button>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            flex flex-col items-center justify-center h-48
            ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-zinc-400"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
              <p className="text-sm font-medium text-white">Subiendo imagen...</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-zinc-400"
            >
              <UploadCloud className={`w-10 h-10 mb-3 ${isDragActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <p className="text-sm font-medium text-zinc-200">
                {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
              </p>
              <p className="text-xs text-zinc-500 mt-2">JPG, PNG o WEBP (Max 5MB)</p>
            </motion.div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
