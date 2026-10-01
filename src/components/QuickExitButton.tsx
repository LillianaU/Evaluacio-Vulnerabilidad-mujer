import React from 'react';

interface QuickExitButtonProps {
  onQuickExit: () => void;
}

export const QuickExitButton: React.FC<QuickExitButtonProps> = ({ onQuickExit }) => {
  return (
    <aside className="fixed bottom-20 right-4 z-50">
      <button
        onClick={onQuickExit}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#3d2060] via-[#5b21b6] to-[#c8a0f0] text-[#e8d0ff] font-headline font-bold text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(91,33,182,0.65)] hover:shadow-[0_8px_28px_rgba(125,211,252,0.4)] active:scale-95 transition-all duration-200 overflow-hidden border border-[#c8a0f0]/30 cursor-pointer"
        type="button"
        title="Salida de Emergencia y Purga Instantánea"
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
