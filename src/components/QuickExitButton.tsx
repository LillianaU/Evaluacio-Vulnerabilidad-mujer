import React, { useState } from 'react';

interface QuickExitButtonProps {
  onQuickExit: () => void;
}

export const QuickExitButton: React.FC<QuickExitButtonProps> = ({ onQuickExit }) => {
  const [showCallInfo, setShowCallInfo] = useState(false);

  return (
    <aside className="fixed bottom-20 right-3 sm:right-5 z-50 flex items-center gap-2">
      {/* Botón Pánico Emergencia 123 Nacional */}
      <div className="relative">
        <a
          href="tel:123"
          className="group relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#b91c1c] text-white font-headline font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(220,38,38,0.7)] hover:shadow-[0_8px_28px_rgba(239,68,68,0.9)] active:scale-95 transition-all duration-200 border border-white/30 cursor-pointer"
          title="Llamada de Emergencia Inmediata - Línea 123 Nacional"
          aria-label="Llamar Línea de Emergencia 123 Nacional"
          onMouseEnter={() => setShowCallInfo(true)}
          onMouseLeave={() => setShowCallInfo(false)}
        >
          {/* Pulso animado */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="material-symbols-outlined text-[17px] text-white drop-shadow">
            e911_emergency
          </span>
          <span className="drop-shadow tracking-wide">Llamar 123</span>
        </a>

        {/* Tooltip explicativo flotante */}
        {showCallInfo && (
          <div className="absolute bottom-full right-0 mb-2 w-52 p-2.5 rounded-xl bg-[#0a0e1a]/95 text-white text-[11px] leading-tight border border-red-500/30 shadow-2xl backdrop-blur-md pointer-events-none z-50">
            <div className="font-bold text-red-400 flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-xs">emergency</span>
              Línea Única de Emergencia 123
            </div>
            Marcación inmediata a Policía Nacional, Ambulancias y atención de crisis 24/7 en Colombia.
          </div>
        )}
      </div>

      {/* Botón Salida Rápida y Purga 0-Trace */}
      <button
        onClick={onQuickExit}
        className="group relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#3d2060] via-[#5b21b6] to-[#c8a0f0] text-[#e8d0ff] font-headline font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(91,33,182,0.65)] hover:shadow-[0_8px_28px_rgba(125,211,252,0.4)] active:scale-95 transition-all duration-200 overflow-hidden border border-[#c8a0f0]/30 cursor-pointer"
        type="button"
        title="Salida de Emergencia y Purga Instantánea de Datos"
        aria-label="Salida Rápida de Emergencia"
      >
        <span className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
        <span className="material-symbols-outlined text-base text-[#7dd3fc] animate-pulse">
          bolt
        </span>
        <span className="drop-shadow-sm tracking-wide text-white">Salida Rápida</span>
      </button>
    </aside>
  );
};
