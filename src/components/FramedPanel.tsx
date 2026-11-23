import React from 'react';

interface FramedPanelProps {
  children: React.ReactNode;
  className?: string;
  showTopCrest?: boolean;
}

export const FramedPanel: React.FC<FramedPanelProps> = ({
  children,
  className = '',
  showTopCrest = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      {showTopCrest && (
        <div className="flex items-center justify-center gap-2 mb-2 text-pink-200/90 select-none">
          <span className="text-xs tracking-widest">✦ ❀</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-950/80 border border-pink-300/60 text-pink-200 font-semibold text-base shadow-[0_0_15px_rgba(244,114,182,0.45)]">
            ♀
          </span>
          <span className="text-xs tracking-widest">❀ ✦</span>
        </div>
      )}

      {/* Marco exterior luminoso */}
      <div className="relative rounded-2xl p-[3px] bg-gradient-to-br from-pink-300/80 via-purple-300/70 to-fuchsia-400/80 shadow-[0_14px_45px_rgba(17,5,32,0.75)]">
        {/* Tarjeta interior perlada de alto contraste */}
        <div className="relative rounded-[13px] bg-[#fff9fd]/95 backdrop-blur-xl text-[#231136] p-4 sm:p-6 border border-purple-900/15">
          {/* Filete interior sutil */}
          <div className="pointer-events-none absolute inset-1.5 rounded-[10px] border border-fuchsia-800/15" />
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
};
