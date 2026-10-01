import React, { useState } from 'react';
import { ScreenType } from '../types';

interface ScreenCamouflageProps {
  onReturnToApp: () => void;
}

export const ScreenCamouflage: React.FC<ScreenCamouflageProps> = ({ onReturnToApp }) => {
  const [searchTerm, setSearchTerm] = useState('recetas saludables faciles con quinoa y verduras');

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0e1a] text-[#e0e8f0] pb-20">
      {/* Decoy Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0f1524]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7dd3fc]">eco</span>
            <span className="text-sm font-semibold tracking-wide text-[#e0e8f0]">
              EcoBienestar &amp; Vida Sana
            </span>
          </div>
          {/* Discrete subtle key to return */}
          <button
            onClick={onReturnToApp}
            className="text-[10px] text-[#4a6070] hover:text-[#7dd3fc] px-2 py-1 rounded bg-[#141c2e] border border-white/5 transition-colors"
            title="Volver a Bóveda Privada"
            type="button"
          >
            Modo Seguro
          </button>
        </div>
      </header>

      {/* Main Decoy Content */}
      <main className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#141c2e] border border-white/10 shadow-inner">
            <span className="material-symbols-outlined text-[#a0b4c4] text-base">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-[#e0e8f0] placeholder-[#a0b4c4] w-full focus:outline-none"
              placeholder="Buscar recetas saludables o senderos..."
            />
            <span className="material-symbols-outlined text-[#a0b4c4] text-sm">mic</span>
          </div>
        </div>

        {/* Quick Weather & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#141c2e]/70 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#7dd3fc]">
              <span className="material-symbols-outlined text-sm">wb_sunny</span>
              <span className="text-[10px] font-semibold uppercase">Clima Hoy</span>
            </div>
            <div className="text-base font-bold text-[#e0e8f0]">22°C Soleado</div>
            <div className="text-[10px] text-[#a0b4c4]">Humedad 45% • Viento calmo</div>
          </div>

          <div className="p-3 rounded-xl bg-[#141c2e]/70 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#c8a0f0]">
              <span className="material-symbols-outlined text-sm">newspaper</span>
              <span className="text-[10px] font-semibold uppercase">Noticias</span>
            </div>
            <div className="text-xs font-medium text-[#e0e8f0] truncate">
              Nuevos senderos ecológicos
            </div>
            <div className="text-[10px] text-[#a0b4c4]">Actualizado hace 12 min</div>
          </div>
        </div>

        {/* Featured Scenic Hero Article */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
          <div
            className="w-full h-44 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAb0FbYhWGZ7rKF2WzOJGng6a3i_PwDJljWWegb4JfhXfN7fXKEmG00YQW-rUykPs9MZiLqdM1-Cb7i62-wA4H_hxrBykCrIw6LDx5pg07Xxqf4yJ6jE0aV1iek8mXIyZTpDKS2NJQHWWywlOVmmCAUP7-u4BxAIKOHxEK40r728SyHSr1YUd5qAtVzAbnrw1XigsP9jRrtWXZgriKJk8yYs9WDSmJx-SdCACeS7pUPoUsPGRYLJP7ctA')`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] uppercase font-bold text-[#7dd3fc] tracking-wider">
                Ecoturismo Sostenible
              </span>
              <h2 className="text-base font-bold text-[#e0e8f0]">
                Parque Nacional El Cristal: Guía de turismo y botánica
              </h2>
            </div>
          </div>
        </div>

        {/* Featured Decoy Recipe */}
        <div className="p-4 rounded-2xl bg-[#141c2e]/70 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#e0e8f0]">
              Bowl de Quinoa con Verduras Salteadas y Aguacate
            </h3>
            <span className="text-[10px] bg-[#0e4d6e] text-[#7dd3fc] px-2 py-0.5 rounded-full">
              Fácil • 20 min
            </span>
          </div>

          <p className="text-xs text-[#a0b4c4] leading-relaxed">
            Una opción deliciosa y nutritiva rica en fibra y antioxidantes. Ideal para almuerzos ligeros que mantienen tu energía equilibrada durante todo el día.
          </p>

          <div className="text-xs space-y-1 text-[#e0e8f0]">
            <p className="font-semibold text-[#7dd3fc]">Ingredientes principales:</p>
            <ul className="list-disc list-inside text-[#a0b4c4] space-y-0.5 text-[11px]">
              <li>1 taza de quinoa previamente cocida</li>
              <li>1 aguacate hass en rodajas finas</li>
              <li>Calabacín, pimentón rojo y champiñones al wok</li>
              <li>Aceite de oliva extra virgen, limón y semillas de ajonjolí</li>
            </ul>
          </div>
        </div>

        {/* Decoy External Search Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              window.location.replace('https://www.google.com/search?q=recetas+saludables+faciles');
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#1a2438] text-[#e0e8f0] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10"
            type="button"
          >
            <span className="material-symbols-outlined text-sm text-[#7dd3fc]">open_in_new</span>
            <span>Buscar más recetas en Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};
