import React, { useState } from 'react';
import { Phone, EyeOff, Info } from 'lucide-react';
import { ScreenType } from '../types';

interface QuickExitButtonProps {
  currentScreen: ScreenType;
  onQuickExit: () => void;
}

export const QuickExitButton: React.FC<QuickExitButtonProps> = ({
  currentScreen,
  onQuickExit,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (currentScreen === 'aerosalud' || currentScreen === 'camuflaje') {
    return null;
  }

  return (
    <aside className="fixed bottom-20 right-3 sm:right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-[#231136] text-pink-100 text-xs px-3 py-2 rounded-xl border border-pink-300/40 shadow-xl max-w-[210px] text-right">
          Línea única de emergencias en Colombia (Policía / Salud / Atención inmediata).
        </div>
      )}

      {/* Llamar 123 con pulso */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setShowTooltip((prev) => !prev)}
          aria-label="Información Línea 123"
          className="w-8 h-8 rounded-full bg-[#24103a]/90 border border-pink-300/40 text-pink-200 flex items-center justify-center shadow-md hover:bg-purple-900 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        <a
          href="tel:123"
          title="Llamada de Emergencia Inmediata - Línea 123 Nacional"
          aria-label="Llamar Línea de Emergencia 123 Nacional"
          className="relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-[0_6px_22px_rgba(225,29,72,0.55)] border border-pink-200/50 hover:brightness-110 active:scale-95 transition cursor-pointer"
        >
          <span className="absolute -inset-0.5 rounded-full bg-rose-400/35 animate-ping pointer-events-none" />
          <Phone className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Llamar 123</span>
        </a>
      </div>

      {/* Salida Rápida */}
      <button
        type="button"
        onClick={onQuickExit}
        title="Salida de Emergencia y Purga Instantánea de Datos"
        aria-label="Salida Rápida de Emergencia"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#231136]/95 hover:bg-[#31174c] text-pink-100 font-bold text-xs sm:text-sm border border-pink-300/50 shadow-[0_8px_24px_rgba(15,5,28,0.8)] active:scale-95 transition cursor-pointer"
      >
        <EyeOff className="w-4 h-4 text-pink-300" />
        <span>Salida Rápida</span>
      </button>
    </aside>
  );
};
