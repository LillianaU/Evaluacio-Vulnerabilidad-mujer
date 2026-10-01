import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // If on AeroSalud emergency protocol or Decoy camouflage, bottom nav is hidden or minimal
  if (currentScreen === 'aerosalud' || currentScreen === 'camuflaje') {
    return null;
  }

  const navItems: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: 'nature_people' },
    { id: 'test', label: 'Test', icon: 'assignment' },
    { id: 'diagnostico', label: 'Diagnóstico', icon: 'analytics' },
    { id: 'boveda', label: 'Bóveda', icon: 'lock' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0f1524]/85 backdrop-blur-2xl border-t border-[#7dd3fc]/10 shadow-[0_-4px_24px_rgba(0,0,0,0.45)]">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 transition-all duration-200 ${
                isActive
                  ? 'text-[#7dd3fc] font-semibold scale-105'
                  : 'text-[#a0b4c4] hover:text-[#e0e8f0]'
              }`}
              type="button"
              aria-label={`Ir a ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-xl ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7dd3fc] shadow-[0_0_6px_#7dd3fc]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-[56px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
