import React, { useState, useEffect } from 'react';
import { RefreshCw, Leaf, ExternalLink } from 'lucide-react';
import { ScreenType } from '../types';
import { FramedPanel } from './FramedPanel';

interface ScreenAeroSaludProps {
  onNavigate: (screen: ScreenType) => void;
  onRedirectGoogle: () => void;
}

export const ScreenAeroSalud: React.FC<ScreenAeroSaludProps> = ({
  onNavigate,
  onRedirectGoogle,
}) => {
  const [stepCompleted, setStepCompleted] = useState(0);

  const runSequence = () => {
    setStepCompleted(0);
    setTimeout(() => setStepCompleted(1), 220);
    setTimeout(() => setStepCompleted(2), 520);
    setTimeout(() => setStepCompleted(3), 850);
  };

  useEffect(() => {
    runSequence();
  }, []);

  const phases = [
    {
      num: 1,
      title: 'Purga Destructiva Local',
      desc: 'sessionStorage, localStorage y estado RAM de respuestas eliminados.',
    },
    {
      num: 2,
      title: 'Revocación Instantánea',
      desc: 'Identificador anónimo y tokens temporales invalidados.',
    },
    {
      num: 3,
      title: 'Salto a Capa Camuflaje',
      desc: 'Portal señuelo EcoBienestar & Vida Sana listo para despliegue.',
    },
  ];

  return (
    <div className="space-y-4">
      <FramedPanel>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/10 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Secuencia de Emergencia Ejecutada
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#231136]">
                Protocolo AeroSalud 0-Trace
              </h2>
            </div>
            <button
              type="button"
              onClick={runSequence}
              className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 transition cursor-pointer"
              title="Re-simular secuencia"
              aria-label="Re-simular secuencia"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Checklist animado de 3 fases */}
          <div className="space-y-2.5">
            {phases.map((p) => {
              const done = stepCompleted >= p.num;
              return (
                <div
                  key={p.num}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                    done
                      ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                      : 'bg-purple-50/60 border-purple-200 text-[#4b3266] opacity-65'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      done ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
                    }`}
                  >
                    {done ? '✓' : p.num}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">{p.title}</div>
                    <div className="text-xs opacity-90 mt-0.5">{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previsualización de la pantalla señuelo */}
          <div className="p-3 rounded-xl bg-[#f3faf5] border border-emerald-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">
                Vista Previa Capa Señuelo
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                24° · Bogotá / Medellín
              </span>
            </div>
            <div className="font-bold text-sm text-emerald-950">
              EcoBienestar &amp; Vida Sana — Portal Informativo
            </div>
            <p className="text-xs text-emerald-900/80">
              Recetas saludables, caminatas ecológicas y hábitos de reciclaje en casa.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('camuflaje')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Leaf className="w-4 h-4" />
              <span>Abrir Pantalla Camuflada (EcoBienestar)</span>
            </button>

            <button
              type="button"
              onClick={onRedirectGoogle}
              className="w-full py-3 px-4 rounded-xl bg-[#231136] hover:bg-[#341a50] text-pink-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-pink-300" />
              <span>Salir a Google (Recetas Saludables Fáciles)</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={runSequence}
                className="text-xs font-semibold text-fuchsia-800 hover:underline cursor-pointer"
              >
                ↻ Re-simular Secuencia
              </button>
              <button
                type="button"
                onClick={() => onNavigate('inicio')}
                className="text-xs font-semibold text-[#4b3266] hover:underline cursor-pointer"
              >
                Volver a Vitality Shield →
              </button>
            </div>
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};
