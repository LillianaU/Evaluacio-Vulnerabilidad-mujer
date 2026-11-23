import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  if (currentScreen === 'camuflaje') return null;

  const isAeroSalud = currentScreen === 'aerosalud';

  const subtitleMap: Record<ScreenType, string> = {
    inicio: 'Orientación confidencial · Ley 1010',
    test: 'Evaluación preventiva (5 criterios)',
    diagnostico: 'Análisis de riesgo y rutas en Colombia',
    boveda: 'Bóveda volátil y control de huella',
    aerosalud: 'Protocolo de Purga y Camuflaje Activo',
    camuflaje: '',
  };

  return (
    <header className="sticky top-0 z-30 pt-safe backdrop-blur-xl bg-[#180b29]/85 border-b border-pink-300/20 shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md transition-transform group-hover:scale-105 ${
              isAeroSalud
                ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-300'
                : 'bg-gradient-to-br from-fuchsia-700 to-purple-900 border-pink-300/50 text-pink-100'
            }`}
          >
            {isAeroSalud ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                {isAeroSalud ? 'AeroSalud Protocol' : 'Vitality Shield'}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isAeroSalud
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                    : 'bg-pink-500/25 text-pink-200 border-pink-300/40'
                }`}
              >
                0-TRACE
              </span>
            </div>
            <p className="text-[11px] text-purple-200/85 truncate max-w-[215px] sm:max-w-[270px]">
              {subtitleMap[currentScreen]}
            </p>
          </div>
        </button>

        {/* Indicador discreto de sesión privada */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-purple-950/80 border border-pink-300/25 text-pink-200 text-xs"
          title="Navegación sin historial URL ni cookies"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-[11px]">RAM</span>
        </div>
      </div>
    </header>
  );
};
