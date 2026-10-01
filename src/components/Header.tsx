import React from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  if (currentScreen === 'aerosalud') {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#0f1524]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)] border-b border-[#7dd3fc]/10">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              aria-label="Regresar"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-[#a0b4c4] hover:text-[#e0e8f0] active:scale-95 transition-all"
              onClick={() => onNavigate('inicio')}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div className="flex flex-col ml-1">
              <span className="text-[11px] font-label font-medium uppercase tracking-wider text-[#88b4cc]">
                AeroSalud Protocol
              </span>
              <h1 className="text-sm font-headline font-semibold text-[#e0e8f0] tracking-tight leading-none mt-0.5">
                Active Sos Transmission
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7dd3fc] flex items-center justify-center shadow-[0_0_12px_rgba(125,211,252,0.4)]">
              <span className="material-symbols-outlined text-[#001f2e] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Titles for standard screens
  let subtitle = 'Inicio / Bienvenida Discreta';
  if (currentScreen === 'test') subtitle = 'Evaluación Cuestionario';
  if (currentScreen === 'diagnostico') subtitle = 'Diagnóstico Y Resultados';
  if (currentScreen === 'boveda') subtitle = 'Guardado Confidencial Y Salida Segura';
  if (currentScreen === 'camuflaje') subtitle = 'Portal de Bienestar y Naturaleza';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0f1524]/75 backdrop-blur-2xl pt-safe shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-b border-[#7dd3fc]/10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => onNavigate('inicio')}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7dd3fc]/30 to-[#c8a0f0]/20 flex items-center justify-center backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] shrink-0 active:scale-95 transition-transform"
            title="Inicio Vitality Shield"
          >
            <span className="material-symbols-outlined text-[#7dd3fc] text-xl">shield_with_heart</span>
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7dd3fc] truncate">
                Vitality Shield
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[#3d2060]/70 text-[#e8d0ff] backdrop-blur-md border border-[#c8a0f0]/20">
                Privado
              </span>
            </div>
            <span className="text-sm font-headline font-bold text-[#e0e8f0] truncate">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1a2438]/80 backdrop-blur-md text-[10px] text-[#a0b4c4] font-medium border border-[#7dd3fc]/15">
            <span className="material-symbols-outlined text-xs text-[#7dd3fc]">lock</span>
            <span>100% Seguro</span>
          </div>
          <img
            alt="Perfil Privado y Seguro"
            className="w-8 h-8 rounded-full object-cover shadow-[0_0_12px_rgba(125,211,252,0.35)] shrink-0 border border-[#7dd3fc]/30"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Xk23lPqO8ZV8DG1NnbYwttqnh5C1w8Hg228E3GmP9uHsKqBhCU-N23KTmVXpmhf13RjnDECP8Us9jef2FjKdS2somAq6FxSPCtxvKskh0sMjKrvCV-2aT_NDB7zJpznLsPQuSitppBwGBVGNkd258oca_tR-eoB7Ma_UDS4lgNcvg5YoxvLL2MCG-J0bhODz-BVVbnUZGO42jT7jZ5PKDpuxDiMCreIROI1F92Sq5QEc7IdTwfqS92Ir8"
          />
        </div>
      </div>
    </header>
  );
};
