
import React, { useRef } from 'react';
import { Verification } from '../types';
import { ExternalLink, Calendar, MapPin, Eye, CheckCircle2, Upload, Loader2, Monitor, Smartphone, Trash2, ShieldCheck } from 'lucide-react';

interface VerificationsGridProps {
  verifications: Verification[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  showUploadZone: boolean;
  isReadOnly?: boolean;
}

const VerificationsGrid: React.FC<VerificationsGridProps> = ({ verifications, onUpload, onDelete, isUploading, showUploadZone, isReadOnly }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* Upload Placeholder */}
      {showUploadZone && !isReadOnly && (
        <div 
          onClick={triggerUpload}
          className={`bg-white rounded-[32px] border-2 border-dashed ${isUploading ? 'border-hypeads-primary' : 'border-slate-200'} flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-slate-50 hover:border-hypeads-primary/30 transition-all duration-300 min-h-[400px]`}
        >
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
           />
           <div className={`w-20 h-20 rounded-3xl bg-hypeads-light flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-hypeads-primary group-hover:text-white transition-all duration-300 ${isUploading ? 'animate-pulse' : ''}`}>
              {isUploading ? (
                <Loader2 className="w-10 h-10 animate-spin text-hypeads-primary group-hover:text-white" />
              ) : (
                <Upload className="w-10 h-10 text-hypeads-primary group-hover:text-white" />
              )}
           </div>
           <h5 className="text-slate-900 text-xl font-black tracking-tight mb-2">
             {isUploading ? 'Analizando con Hypeads AI...' : 'Subir Nueva Verificación'}
           </h5>
           <p className="text-sm text-slate-400 font-medium max-w-xs">
             {isUploading ? 'Nuestra inteligencia artificial está detectando el sitio, formato y dispositivo.' : 'Arrastra una captura de pantalla o haz clic para seleccionar un archivo.'}
           </p>
        </div>
      )}

      {/* Loading Placeholder Card */}
      {isUploading && (
        <div className="bg-white rounded-[32px] overflow-hidden border border-hypeads-primary/20 shadow-xl shadow-hypeads-primary/5 animate-pulse">
           <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-hypeads-primary animate-spin" />
           </div>
           <div className="p-8 space-y-4">
              <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
              <div className="space-y-2">
                 <div className="h-4 bg-slate-50 rounded-full w-1/2"></div>
                 <div className="h-4 bg-slate-50 rounded-full w-2/3"></div>
              </div>
           </div>
        </div>
      )}

      {/* Verification Cards */}
      {verifications.map((v) => (
        <div key={v.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-hypeads-primary/10 transition-all duration-500 group relative">
          
          {/* Delete Button (Hidden in Read Only) */}
          {!isReadOnly && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(v.id);
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full shadow-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
              title="Eliminar verificación"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Screenshot Preview */}
          <div className="relative aspect-video overflow-hidden bg-slate-100">
            <img 
              src={v.imageUrl} 
              alt={v.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <a 
                href={v.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-hypeads-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Sitio Original
              </a>
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
               <span className="bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-hypeads-primary" />
                  {v.site}
               </span>
               {v.device && (
                 <span className="bg-hypeads-primary text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    {v.device.toLowerCase().includes('mobile') ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                    {v.device}
                 </span>
               )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-hypeads-primary transition-colors pr-4">{v.title}</h4>
              <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {v.format && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {v.format}
                </span>
              )}
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {v.timestamp}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 mb-6">
                <Eye className="w-4 h-4 text-hypeads-primary/60" />
                <span className="text-xs font-bold uppercase tracking-tighter">Impacto Visual Auditado por AI</span>
            </div>
            
            <a 
               href={v.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-hypeads-light/30 hover:border-hypeads-primary/20 transition-all group/link"
            >
               <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Referencia de enlace</span>
                  <span className="text-xs text-slate-500 font-medium truncate italic">{v.url}</span>
               </div>
               <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 group-hover/link:bg-hypeads-primary group-hover/link:text-white group-hover/link:border-hypeads-primary transition-all">
                  <ExternalLink className="w-4 h-4" />
               </div>
            </a>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {!showUploadZone && verifications.length === 0 && !isUploading && (
        <div className="col-span-full bg-white rounded-[32px] p-20 text-center border border-slate-100 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <ShieldCheck className="w-10 h-10" />
           </div>
           <h4 className="text-xl font-black text-slate-900 mb-2">No hay verificaciones cargadas</h4>
           {!isReadOnly && <p className="text-slate-400 text-sm max-w-sm mx-auto">Activa "Mostrar Carga" para añadir nuevas capturas de pantalla.</p>}
        </div>
      )}
    </div>
  );
};

export default VerificationsGrid;
