import React from 'react';
import { Home, ClipboardCheck, Activity, FolderLock } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  hasDiagnosis: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  hasDiagnosis,
}) => {
  if (currentScreen === 'aerosalud' || currentScreen === 'camuflaje') {
    return null;
  }

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'test', label: 'Test', icon: <ClipboardCheck className="w-5 h-5" /> },
    {
      id: 'diagnostico',
      label: 'Diagnóstico',
      icon: <Activity className="w-5 h-5" />,
      badge: hasDiagnosis,
    },
    { id: 'boveda', label: 'Bóveda', icon: <FolderLock className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 z-30 pb-safe backdrop-blur-xl bg-[#180b29]/92 border-t border-pink-300/25 shadow-[0_-8px_30px_rgba(12,4,24,0.7)]"
    >
      <div className="max-w-lg mx-auto px-2 py-2 grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={`Ir a ${item.label}`}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/35 text-white border border-pink-300/40 shadow-inner'
                  : 'text-purple-200/75 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400" />
                )}
              </div>
              <span className="text-[11px] font-semibold mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
