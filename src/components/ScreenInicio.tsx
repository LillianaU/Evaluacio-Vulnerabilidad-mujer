import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Lock,
  HeartHandshake,
  EyeOff,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ScreenType } from '../types';
import { FramedPanel } from './FramedPanel';

interface ScreenInicioProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ScreenInicio: React.FC<ScreenInicioProps> = ({ onNavigate }) => {
  const [expandedArchitecture, setExpandedArchitecture] = useState(false);

  return (
    <div className="space-y-5">
      {/* Banner escénico sereno con insignia de anonimato */}
      <div className="text-center space-y-2 pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-pink-300/40 text-pink-200 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>Espacio Seguro · Sin Rastro Digital</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(244,114,182,0.45)]">
          Vitality Shield
        </h1>
        <p className="text-xs sm:text-sm text-purple-100/90 max-w-md mx-auto leading-relaxed">
          Acompañamiento confidencial y orientación preventiva frente al acoso laboral en Colombia
          (Ley 1010 de 2006).
        </p>
      </div>

      {/* Panel central enmarcado de alto contraste */}
      <FramedPanel showTopCrest>
        <div className="space-y-4">
          <div className="text-center space-y-1.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-fuchsia-800 bg-fuchsia-100 px-2.5 py-0.5 rounded-full">
              Orientación Confidencial
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#231136]">
              Evalúa tu situación laboral sin dejar huella
            </h2>
            <p className="text-xs sm:text-sm text-[#43295e] leading-relaxed">
              No pedimos tu nombre, correo ni empresa. Toda la evaluación ocurre en la memoria
              temporal de tu dispositivo y puedes activar modo camuflaje en un toque.
            </p>
          </div>

          {/* Botón principal de inicio */}
          <button
            type="button"
            onClick={() => onNavigate('test')}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#581c87] via-[#86198f] to-[#be185d] hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-[0_8px_20px_rgba(134,25,143,0.35)] flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <span>Iniciar Evaluación Confidencial</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 3 Tarjetas de Garantías */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-purple-50/90 border border-purple-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-800 text-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
                  1. Privacidad Total (0-Trace)
                </h3>
                <p className="text-xs text-[#4b3266] leading-snug mt-0.5">
                  Sin cookies de rastreo ni cambios en la URL del navegador. Nada queda guardado en
                  tu historial web.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-pink-50/90 border border-pink-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
                  2. Orientación Legal &amp; Apoyo — Línea 155
                </h3>
                <p className="text-xs text-[#4b3266] leading-snug mt-0.5">
                  Criterios alineados con la Ley 1010 de 2006 y acceso directo a líneas gratuitas en
                  Colombia (155, 122, 106 y 123).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-fuchsia-50/90 border border-fuchsia-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-fuchsia-800 text-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#231136]">
                  3. Salida Rápida y Limpieza Instantánea
                </h3>
                <p className="text-xs text-[#4b3266] leading-snug mt-0.5">
                  Si alguien se acerca, pulsa <strong>Salida Rápida</strong> para purgar datos y
                  mostrar el portal señuelo <em>EcoBienestar</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Panel desplegable: Arquitectura Offline-First */}
          <div className="border-t border-purple-900/10 pt-3">
            <button
              type="button"
              onClick={() => setExpandedArchitecture((prev) => !prev)}
              className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl bg-[#f5ebfa] hover:bg-[#eedcf7] text-[#2c1544] font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-fuchsia-700" />
                <span>¿Cómo funciona la arquitectura Offline-First y Cero Huella?</span>
              </span>
              {expandedArchitecture ? (
                <ChevronUp className="w-4 h-4 text-fuchsia-700 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-fuchsia-700 shrink-0" />
              )}
            </button>

            {expandedArchitecture && (
              <div className="mt-2 p-3.5 rounded-xl bg-white border border-purple-200 text-xs text-[#3b2354] space-y-2 leading-relaxed">
                <p>
                  • <strong>Navegación en memoria:</strong> Las vistas cambian sin modificar la
                  barra de direcciones ni registrar rutas internas en el historial.
                </p>
                <p>
                  • <strong>Informes PDF en RAM:</strong> Tu reporte se construye localmente en
                  memoria volátil y el enlace temporal se destruye en 100 ms.
                </p>
                <p>
                  • <strong>Capa Camuflaje:</strong> Puedes probar cómo luce la pantalla señuelo{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('camuflaje')}
                    className="underline font-bold text-fuchsia-700 hover:text-fuchsia-900 cursor-pointer"
                  >
                    EcoBienestar &amp; Vida Sana aquí
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </FramedPanel>
    </div>
  );
};
