import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';

interface ScreenAeroSaludProps {
  onNavigate: (screen: ScreenType) => void;
  onRedirectGoogle: () => void;
}

export const ScreenAeroSalud: React.FC<ScreenAeroSaludProps> = ({
  onNavigate,
  onRedirectGoogle,
}) => {
  const [latency, setLatency] = useState(142);
  const [progressWidth, setProgressWidth] = useState(100);
  const [isFlashing, setIsFlashing] = useState(false);

  const runPurgeSequence = () => {
    setIsFlashing(true);
    setProgressWidth(0);

    setTimeout(() => {
      setIsFlashing(false);
    }, 120);

    let counter = 0;
    const target = Math.floor(Math.random() * (165 - 128 + 1)) + 128;
    const interval = setInterval(() => {
      counter += 14;
      if (counter >= target) {
        counter = target;
        clearInterval(interval);
      }
      setLatency(counter);
    }, 15);

    setTimeout(() => {
      setProgressWidth(100);
    }, 220);
  };

  useEffect(() => {
    // Run an initial quick simulation when entering screen
    runPurgeSequence();
  }, []);

  return (
    <div className="flex flex-col w-full relative overflow-hidden px-4 py-5 gap-5 max-w-lg mx-auto">
      {/* Flash overlay for tactical purge animation */}
      <div
        className={`fixed inset-0 bg-[#7dd3fc]/30 pointer-events-none transition-opacity duration-200 z-50 ${
          isFlashing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Atmospheric backdrop glows */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#7dd3fc]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-[#c8a0f0]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#1a3a4e]/20 blur-3xl pointer-events-none" />

      {/* Top Banner: Protocolo AeroSalud 0-Trace */}
      <div className="relative w-full rounded-2xl bg-[#141c2e]/70 backdrop-blur-2xl p-5 shadow-2xl overflow-hidden border border-[#7dd3fc]/15">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7dd3fc]/10 via-transparent to-[#c8a0f0]/10 pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3d1414] text-[#ff6b6b] flex items-center justify-center shadow-lg shadow-[#ff6b6b]/20 animate-pulse border border-[#ff6b6b]/30">
              <span className="material-symbols-outlined text-xl filled">bolt</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#7dd3fc]">
                Protocolo AeroSalud 0-Trace
              </span>
              <span className="text-xs font-semibold text-[#e0e8f0]">
                Salida Rápida Ejecutada
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#ff6b6b]/20 text-[#ff6b6b] border border-[#ff6b6b]/30">
            Activo
          </span>
        </div>

        <div className="relative flex items-baseline justify-between pt-1 pb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#7dd3fc] font-headline">
              {latency}
            </span>
            <span className="text-xs font-medium text-[#88b4cc]">ms</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] block font-medium text-[#a0b4c4]">Rendimiento Táctico</span>
            <span className="text-xs font-semibold text-[#7dd3fc]">Meta: &lt; 200 ms superada</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#202c42]/80 rounded-full h-1.5 overflow-hidden my-2 border border-white/5">
          <div
            className="bg-gradient-to-r from-[#7dd3fc] via-[#88b4cc] to-[#c8a0f0] h-full rounded-full transition-all duration-700"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-[#a0b4c4] pt-1 font-mono">
          <span>ESTADO: TOTALMENTE ENCRIPTADO</span>
          <span className="text-[#7dd3fc] font-bold">100% PURGADO</span>
        </div>
      </div>

      {/* Secuencia Destructiva en Cadena */}
      <div className="w-full rounded-2xl bg-[#111828]/70 backdrop-blur-xl p-4 shadow-xl flex flex-col gap-3 border border-[#7dd3fc]/15">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7dd3fc] text-[18px]">verified_user</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#e0e8f0]">
              Secuencia Destructiva en Cadena
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#88b4cc]">3/3 FASES OK</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Phase 1 */}
          <div className="relative flex items-center gap-3 p-3 rounded-xl bg-[#141c2e]/60 backdrop-blur-md border border-[#7dd3fc]/10">
            <div className="w-8 h-8 rounded-lg bg-[#0e4d6e] text-[#c8eaff] flex items-center justify-center shrink-0 border border-[#7dd3fc]/20">
              <span className="material-symbols-outlined text-base">delete_sweep</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#e0e8f0]">
                  Fase 1: Purga Destructiva Local
                </span>
                <span className="text-[10px] font-bold text-[#7dd3fc] font-mono">0ms</span>
              </div>
              <p className="text-[11px] text-[#a0b4c4] truncate">
                purgerLocalData() • LocalStorage, IndexedDB y Caché eliminados
              </p>
            </div>
            <span className="material-symbols-outlined text-[#7dd3fc] text-base shrink-0 filled">
              check_circle
            </span>
          </div>

          {/* Phase 2 */}
          <div className="relative flex items-center gap-3 p-3 rounded-xl bg-[#141c2e]/60 backdrop-blur-md border border-[#c8a0f0]/10">
            <div className="w-8 h-8 rounded-lg bg-[#3d2060] text-[#e8d0ff] flex items-center justify-center shrink-0 border border-[#c8a0f0]/20">
              <span className="material-symbols-outlined text-base">key_off</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#e0e8f0]">
                  Fase 2: Revocación Instantánea
                </span>
                <span className="text-[10px] font-bold text-[#c8a0f0] font-mono">+48ms</span>
              </div>
              <p className="text-[11px] text-[#a0b4c4] truncate">
                Anulación de tokens efímeros JWT y cierre de sesión seguro
              </p>
            </div>
            <span className="material-symbols-outlined text-[#7dd3fc] text-base shrink-0 filled">
              check_circle
            </span>
          </div>

          {/* Phase 3 */}
          <div className="relative flex items-center gap-3 p-3 rounded-xl bg-[#141c2e]/60 backdrop-blur-md border border-[#88b4cc]/10">
            <div className="w-8 h-8 rounded-lg bg-[#1a3a4e] text-[#c0d8e8] flex items-center justify-center shrink-0 border border-[#88b4cc]/20">
              <span className="material-symbols-outlined text-base">travel_explore</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#e0e8f0]">
                  Fase 3: Salto a Capa Camuflaje
                </span>
                <span className="text-[10px] font-bold text-[#88b4cc] font-mono">+94ms</span>
              </div>
              <p className="text-[11px] text-[#a0b4c4] truncate">
                Redirección a interfaz réplica sin historial previo en navegador
              </p>
            </div>
            <span className="material-symbols-outlined text-[#7dd3fc] text-base shrink-0 filled">
              check_circle
            </span>
          </div>
        </div>
      </div>

      {/* Previsualización de Cortina (Vista Camuflada / Modo Señuelo) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c8a0f0] text-base">visibility</span>
            <span className="text-xs font-semibold text-[#e0e8f0]">
              Previsualización de Cortina (Vista Camuflada)
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#88b4cc] tracking-wider">
            Modo Señuelo
          </span>
        </div>

        <div className="relative w-full rounded-2xl bg-[#202c42]/60 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden flex flex-col gap-3 border border-[#7dd3fc]/20">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#7dd3fc]/20 blur-2xl pointer-events-none" />

          {/* Decoy Search Bar */}
          <div
            onClick={() => onNavigate('camuflaje')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141c2e]/90 border border-white/5 cursor-pointer hover:bg-[#1a2438] transition-colors"
          >
            <span className="material-symbols-outlined text-[#a0b4c4] text-base">search</span>
            <span className="text-xs font-medium text-[#e0e8f0] tracking-wide flex-1 truncate">
              recetas saludables faciles con quinoa y verduras
            </span>
            <span className="material-symbols-outlined text-[#a0b4c4] text-sm">mic</span>
          </div>

          {/* Decoy Weather and News Cards */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-[#141c2e]/70 flex flex-col gap-1.5 border border-white/5">
              <div className="flex items-center gap-1.5 text-[#7dd3fc]">
                <span className="material-symbols-outlined text-sm">wb_sunny</span>
                <span className="text-[10px] font-semibold uppercase">Clima Hoy</span>
              </div>
              <div className="text-base font-bold text-[#e0e8f0]">22°C Soleado</div>
              <div className="text-[9px] text-[#a0b4c4]">Humedad 45% • Viento calmo</div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#141c2e]/70 flex flex-col gap-1.5 border border-white/5">
              <div className="flex items-center gap-1.5 text-[#c8a0f0]">
                <span className="material-symbols-outlined text-sm">newspaper</span>
                <span className="text-[10px] font-semibold uppercase">Noticias</span>
              </div>
              <div className="text-xs font-medium text-[#e0e8f0] truncate">
                Nuevos senderos ecológicos
              </div>
              <div className="text-[9px] text-[#a0b4c4]">Actualizado hace 12 min</div>
            </div>
          </div>

          {/* Decoy Nature Feature Box */}
          <div
            onClick={() => onNavigate('camuflaje')}
            className="relative rounded-xl overflow-hidden h-28 w-full shadow-inner border border-white/10 cursor-pointer group"
          >
            <div
              className="bg-cover bg-center w-full h-full flex flex-col justify-end p-2.5 transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAb0FbYhWGZ7rKF2WzOJGng6a3i_PwDJljWWegb4JfhXfN7fXKEmG00YQW-rUykPs9MZiLqdM1-Cb7i62-wA4H_hxrBykCrIw6LDx5pg07Xxqf4yJ6jE0aV1iek8mXIyZTpDKS2NJQHWWywlOVmmCAUP7-u4BxAIKOHxEK40r728SyHSr1YUd5qAtVzAbnrw1XigsP9jRrtWXZgriKJk8yYs9WDSmJx-SdCACeS7pUPoUsPGRYLJP7ctA')`,
              }}
            >
              <div className="bg-[#0a0e1a]/80 backdrop-blur-md rounded-lg p-2 flex items-center justify-between border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#e0e8f0]">
                    Parque Nacional El Cristal
                  </span>
                  <span className="text-[9px] text-[#a0b4c4]">Guía de turismo y botánica</span>
                </div>
                <span className="material-symbols-outlined text-[#7dd3fc] text-base">
                  open_in_new
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory and Web History Indicators */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-xl bg-[#141c2e]/60 backdrop-blur-lg p-3 flex items-center gap-3 border border-[#7dd3fc]/15">
          <div className="w-9 h-9 rounded-lg bg-[#7dd3fc]/10 text-[#7dd3fc] flex items-center justify-center shrink-0 border border-[#7dd3fc]/20">
            <span className="material-symbols-outlined text-lg">memory</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-[#a0b4c4]">Memoria RAM</span>
            <span className="text-xs font-bold text-[#e0e8f0]">0.00 KB Sanitizada</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#141c2e]/60 backdrop-blur-lg p-3 flex items-center gap-3 border border-[#c8a0f0]/15">
          <div className="w-9 h-9 rounded-lg bg-[#c8a0f0]/10 text-[#c8a0f0] flex items-center justify-center shrink-0 border border-[#c8a0f0]/20">
            <span className="material-symbols-outlined text-lg">history_toggle_off</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-[#a0b4c4]">Historial Web</span>
            <span className="text-xs font-bold text-[#e0e8f0]">Sobrescrito</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-2 pb-6">
        <button
          onClick={runPurgeSequence}
          className="w-full py-3.5 px-4 rounded-xl bg-[#7dd3fc] text-[#001f2e] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7dd3fc]/20 active:scale-[0.98] transition-all cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base">replay</span>
          <span>Re-Simular Purga Instantánea</span>
        </button>

        <button
          onClick={onRedirectGoogle}
          className="w-full py-3.5 px-4 rounded-xl bg-[#1a2438] hover:bg-[#202c42] text-[#e0e8f0] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all border border-[#88b4cc]/20 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base text-[#88b4cc]">exit_to_app</span>
          <span>Probar Redirección Inmediata a Google</span>
        </button>

        <button
          onClick={() => onNavigate('camuflaje')}
          className="w-full py-3 px-4 rounded-xl bg-[#3d2060]/60 hover:bg-[#3d2060] text-[#e8d0ff] font-semibold text-xs tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all border border-[#c8a0f0]/30 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base text-[#c8a0f0]">visibility</span>
          <span>Ver Pantalla Completa Camuflada (Decoy)</span>
        </button>
      </div>
    </div>
  );
};
