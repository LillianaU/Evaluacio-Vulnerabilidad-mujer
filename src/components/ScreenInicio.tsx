import React, { useState } from 'react';
import { ScreenType } from '../types';

interface ScreenInicioProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ScreenInicio: React.FC<ScreenInicioProps> = ({ onNavigate }) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="flex flex-col w-full relative overflow-hidden px-4 py-5 gap-6 max-w-lg mx-auto">
      {/* Ambient Light Orbs & Luminous Backdrop */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#7dd3fc]/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-96 -left-20 w-64 h-64 rounded-full bg-[#c8a0f0]/10 blur-[70px] pointer-events-none -z-10" />

      {/* Decorative Scenic Window with Frutiger Aero Light & Serenity */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#141c2e]/60 backdrop-blur-xl border border-[#7dd3fc]/20">
        <div
          className="relative w-full h-44 sm:h-52 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcHAvLbG2VeUdkF5GmFi5AnCXe7fIYlwYlTUyCb7IQw_evt_FLw5-Gtt6W51s6JP58QD-cwLu6NMJLfljv4mXAessY-RIpe-NmJADdDHvnj3lwnSGBOPUZJjLjvCYAYy73NmqmQBVzruuBEP9-MXUmXVjwbuS2jfST7JkbdNfUn1yMs7F0fZ-DROf6OX35WGaSK-0TnRAYjqtBaXI5-8IVu_7HJWZnABGVO13k4fAqqRLIMXdMvbYpEw')`,
          }}
        >
          {/* Specular & Atmospheric Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1524] via-[#0f1524]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7dd3fc]/20 via-transparent to-[#c8a0f0]/15 mix-blend-screen pointer-events-none" />

          {/* Live Floating Bubbles Effect Overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none opacity-80">
            <span className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] animate-pulse" />
            <span className="w-4 h-4 rounded-full bg-[#c8eaff]/35 backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] -mt-10 animate-bounce duration-1000" />
            <span className="w-6 h-6 rounded-full bg-[#e8d0ff]/30 backdrop-blur-sm shadow-[inset_0_1px_3px_rgba(255,255,255,0.6)] mt-8 animate-pulse" />
          </div>

          {/* Discretion Badge on Image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0e1a]/80 backdrop-blur-md shadow-md border border-[#7dd3fc]/25">
            <span className="w-2 h-2 rounded-full bg-[#7dd3fc] animate-ping" />
            <span className="text-[11px] font-medium tracking-wide text-[#c8eaff]">
              Acceso 100% Anónimo y Cero Rastreadores
            </span>
          </div>

          {/* Calming micro phrase bottom of image banner */}
          <div className="absolute bottom-2.5 right-3.5 flex items-center gap-1 text-[11px] font-medium text-[#e0e8f0]/90 drop-shadow">
            <span className="material-symbols-outlined text-sm text-[#7dd3fc]">spa</span>
            <span>Espacio Libre de Monitoreo</span>
          </div>
        </div>
      </div>

      {/* Hero Glassmorphism Panel */}
      <div className="relative w-full rounded-2xl bg-[#141c2e]/75 backdrop-blur-2xl p-5 shadow-xl flex flex-col gap-3 border border-[#7dd3fc]/15">
        {/* Top highlight specular strip */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#7dd3fc]/40 to-transparent" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0e4d6e]/80 flex items-center justify-center text-[#7dd3fc] shadow-sm shrink-0 border border-[#7dd3fc]/30">
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </div>
          <span className="text-xs font-semibold text-[#7dd3fc] uppercase tracking-wider">
            Orientación Confidencial
          </span>
        </div>

        <h1 className="text-2xl font-headline font-bold text-[#e0e8f0] leading-tight tracking-tight">
          Espacio Seguro de Orientación y Bienestar Laboral
        </h1>

        <p className="text-sm font-body text-[#a0b4c4] leading-relaxed">
          Una herramienta confidencial, ágil y sin registro de identidad para evaluar con claridad situaciones de presión o posible acoso laboral, accediendo al instante a rutas de apoyo confiables.
        </p>

        {/* Key Assurances Pill Ribbon */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a3a4e]/60 backdrop-blur-md text-[11px] text-[#c0d8e8] font-medium border border-[#7dd3fc]/20">
            <span className="material-symbols-outlined text-xs text-[#7dd3fc]">cloud_off</span>
            <span>100% Offline-First</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a3a4e]/60 backdrop-blur-md text-[11px] text-[#c0d8e8] font-medium border border-[#7dd3fc]/20">
            <span className="material-symbols-outlined text-xs text-[#7dd3fc]">vpn_key_off</span>
            <span>Sin cuentas ni correos</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a3a4e]/60 backdrop-blur-md text-[11px] text-[#c0d8e8] font-medium border border-[#7dd3fc]/20">
            <span className="material-symbols-outlined text-xs text-[#7dd3fc]">phonelink_lock</span>
            <span>Cifrado en Memoria</span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7dd3fc] text-base">privacy_tip</span>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#a0b4c4]">
            Tus Garantías de Protección
          </span>
        </div>
        <span className="text-[10px] text-[#7dd3fc] bg-[#0e4d6e]/50 border border-[#7dd3fc]/30 px-2 py-0.5 rounded-full font-medium">
          Ley 1010 / Colombia
        </span>
      </div>

      {/* Informative Aqua Glass Cards Mosaic */}
      <div className="flex flex-col gap-3.5">
        {/* Card 1: Privacidad Total */}
        <div className="relative group rounded-xl p-4 bg-[#141c2e]/65 backdrop-blur-xl shadow-lg hover:bg-[#1a2438]/80 transition-all duration-200 border border-[#7dd3fc]/10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0e4d6e] to-[#1a3a4e] flex items-center justify-center text-[#7dd3fc] shadow-[0_0_12px_rgba(125,211,252,0.15)] shrink-0 border border-[#7dd3fc]/25">
              <span className="material-symbols-outlined text-xl">folder_managed</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-headline font-semibold text-[#e0e8f0]">
                  Privacidad Total
                </h2>
                <span className="text-[10px] font-medium text-[#7dd3fc] bg-[#202c42] px-2 py-0.5 rounded-full border border-[#7dd3fc]/15">
                  LocalStorage
                </span>
              </div>
              <p className="text-xs text-[#a0b4c4] leading-relaxed">
                Tus respuestas y selecciones se procesan exclusivamente en este dispositivo móvil. No transmitimos métricas, no guardamos IP ni alimentamos servidores externos.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Orientación Legal & Apoyo */}
        <div className="relative group rounded-xl p-4 bg-[#141c2e]/65 backdrop-blur-xl shadow-lg hover:bg-[#1a2438]/80 transition-all duration-200 border border-[#c8a0f0]/10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3d2060] to-[#1a2438] flex items-center justify-center text-[#c8a0f0] shadow-[0_0_12px_rgba(200,160,240,0.15)] shrink-0 border border-[#c8a0f0]/25">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-headline font-semibold text-[#e0e8f0]">
                  Orientación Legal &amp; Apoyo
                </h2>
                <span className="text-[10px] font-medium text-[#c8a0f0] bg-[#3d2060]/50 px-2 py-0.5 rounded-full border border-[#c8a0f0]/20">
                  Línea 155
                </span>
              </div>
              <p className="text-xs text-[#a0b4c4] leading-relaxed">
                Mapea tus experiencias frente a los criterios tipificados en la Ley de Acoso Laboral y conoce rutas de ayuda institucionales inmediatas y gratuitas.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Botón de Salida Rápida */}
        <div className="relative group rounded-xl p-4 bg-[#141c2e]/65 backdrop-blur-xl shadow-lg hover:bg-[#1a2438]/80 transition-all duration-200 border border-[#ff6b6b]/10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3d1414] to-[#1a2438] flex items-center justify-center text-[#ff6b6b] shadow-[0_0_12px_rgba(255,107,107,0.15)] shrink-0 border border-[#ff6b6b]/25">
              <span className="material-symbols-outlined text-xl">shutter_speed</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-headline font-semibold text-[#e0e8f0]">
                  Salida Rápida y Limpieza
                </h2>
                <span className="text-[10px] font-medium text-[#ff6b6b] bg-[#3d1414]/70 px-2 py-0.5 rounded-full border border-[#ff6b6b]/25">
                  Instantáneo
                </span>
              </div>
              <p className="text-xs text-[#a0b4c4] leading-relaxed">
                Un solo toque en el botón flotante limpia al instante los datos temporales del navegador y te redirige de inmediato a una pestaña neutra de consulta general.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Interactive Actions */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Main Diagnostic Assessment Button */}
        <button
          onClick={() => onNavigate('test')}
          className="relative group flex items-center justify-center gap-2.5 w-full min-h-[52px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#3d2060] to-[#0e4d6e] text-white font-headline font-bold text-sm tracking-wide shadow-xl shadow-[#5b21b6]/30 active:scale-[0.98] transition-all duration-200 overflow-hidden cursor-pointer border border-[#c8a0f0]/30"
          type="button"
        >
          {/* Specular gloss light sheen */}
          <span className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/30 pointer-events-none" />
          <span className="text-white drop-shadow font-semibold">Iniciar Evaluación Diagnóstica</span>
          <span className="material-symbols-outlined text-white text-lg transition-transform duration-200 group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>

        {/* Secondary Explanatory CTA */}
        <button
          onClick={() => setShowPrivacyModal(!showPrivacyModal)}
          className="flex items-center justify-center gap-2 w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#1a2438]/80 hover:bg-[#202c42] text-[#e0e8f0] text-xs font-semibold tracking-wide backdrop-blur-md shadow-md active:scale-[0.99] transition-all duration-200 border border-[#7dd3fc]/20 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base text-[#7dd3fc]">security</span>
          <span>¿Cómo protegemos tus datos? (Offline-first)</span>
        </button>
      </div>

      {/* Collapsible Privacy Explanation Panel */}
      {showPrivacyModal && (
        <div className="rounded-xl p-4 bg-[#0a0e1a]/95 backdrop-blur-2xl shadow-xl flex flex-col gap-3 border border-[#7dd3fc]/30 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7dd3fc] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">enhanced_encryption</span> Arquitectura de Anonimato
            </span>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="text-[#a0b4c4] hover:text-[#e0e8f0] p-1"
              type="button"
              aria-label="Cerrar detalles de privacidad"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="text-[11px] text-[#a0b4c4] space-y-2 leading-relaxed">
            <p>
              • <strong className="text-[#e0e8f0]">Cero transmisiones remotas:</strong> El algoritmo de ponderación se ejecuta íntegramente en tu navegador web mediante funciones de cómputo local.
            </p>
            <p>
              • <strong className="text-[#e0e8f0]">Sesión efímera:</strong> Al salir o cerrar la ventana, no persiste ningún registro en el historial de navegación ni servidores externos.
            </p>
            <p>
              • <strong className="text-[#e0e8f0]">Sin permisos intrusivos:</strong> No solicitamos acceso a tu cámara, libreta de contactos, ubicación GPS ni notificaciones push.
            </p>
          </div>
        </div>
      )}

      {/* Discreet Safety Assurance Stamp */}
      <div className="flex flex-col items-center justify-center text-center gap-1 pt-1 pb-6">
        <div className="flex items-center gap-1.5 text-[#a0b4c4] text-[11px]">
          <span className="material-symbols-outlined text-xs text-[#7dd3fc]">lock_clock</span>
          <span>Compatible sin conexión a internet • Cero cookies publicitarias</span>
        </div>
        <span className="text-[10px] text-[#4a6070]">
          Datos cifrados localmente en la memoria temporal del terminal
        </span>
      </div>
    </div>
  );
};
