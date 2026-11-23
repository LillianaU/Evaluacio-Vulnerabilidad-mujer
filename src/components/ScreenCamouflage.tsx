import React, { useState } from 'react';
import { Search, CloudSun, Leaf, Compass, Utensils } from 'lucide-react';

interface ScreenCamouflageProps {
  onReturnToApp: () => void;
}

export const ScreenCamouflage: React.FC<ScreenCamouflageProps> = ({ onReturnToApp }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-800 pb-12">
      {/* Barra superior del portal ecológico señuelo */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-emerald-950 tracking-tight">
              EcoBienestar <em className="font-serif font-normal text-emerald-700">&amp; Vida Sana</em>
            </span>
          </div>

          {/* Botón discreto para regresar al modo seguro */}
          <button
            type="button"
            onClick={onReturnToApp}
            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold transition cursor-pointer"
            title="Regresar a la aplicación protegida"
          >
            Modo Seguro
          </button>
        </div>
      </header>

      {/* Contenido del portal señuelo */}
      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Barra de búsqueda editable */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar recetas saludables, senderos, reciclaje..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tarjeta del clima */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun className="w-8 h-8 text-amber-500" />
            <div>
              <div className="text-xl font-extrabold text-slate-900">24°</div>
              <div className="text-xs text-slate-600">
                Parcialmente nublado · Humedad 68 %
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
            Clima Local
          </span>
        </div>

        {/* Artículo 1: Noticias verdes */}
        <article className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            <Leaf className="w-3 h-3" /> Noticias verdes
          </span>
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            Cinco hábitos de reciclaje que sí reducen tu huella en casa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Separar en origen, compostar los residuos de cocina y reparar antes de reemplazar son
            los cambios con mayor efecto sostenido, según varios programas municipales.
          </p>
        </article>

        {/* Artículo 2: Naturaleza */}
        <article className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
            <Compass className="w-3 h-3" /> Naturaleza
          </span>
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            Parque Nacional El Cristal: una caminata entre niebla y frailejones
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Un recorrido de media jornada con senderos señalizados, mirador al amanecer y guías
            locales. Se recomienda llevar capa impermeable y agua.
          </p>
        </article>

        {/* Artículo 3: Receta */}
        <article className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
            <Utensils className="w-3 h-3" /> Receta · 25 min
          </span>
          <h3 className="font-bold text-base text-slate-900">
            Bowl de quinoa con verduras asadas
          </h3>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>1 taza de quinoa cocida</li>
            <li>Zanahoria, calabacín y pimentón asados</li>
            <li>Garbanzos, aguacate y limón</li>
          </ul>
        </article>

        {/* Pie de página señuelo */}
        <footer className="text-center text-xs text-slate-500 pt-2">
          © 2026 EcoBienestar &amp; Vida Sana · Contenido informativo
        </footer>
      </main>
    </div>
  );
};
