import React from 'react';

export const EtherealFloralBackdrop: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Degradado base crepuscular púrpura profundo y ciruela */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 18%, #3b175c 0%, #24103a 42%, #140922 100%)',
        }}
      />

      {/* Resplandores radiales rosa y lavanda */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-35 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)',
          animationDuration: '7s',
        }}
      />
      <div
        className="absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
          animationDuration: '9s',
        }}
      />
      <div
        className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #e879f9 0%, transparent 72%)',
        }}
      />

      {/* Flor espectral luminosa superior izquierda */}
      <svg
        className="absolute top-6 -left-10 w-64 h-64 sm:w-80 sm:h-80 opacity-45"
        viewBox="0 0 240 240"
        fill="none"
      >
        <defs>
          <radialGradient id="petalGlowLeft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#f472b6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <g transform="translate(120,120)">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg})`}
              d="M0,0 C22,-36 32,-76 0,-105 C-32,-76 -22,-36 0,0 Z"
              fill="url(#petalGlowLeft)"
              stroke="#f9a8d4"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
          ))}
          <circle cx="0" cy="0" r="10" fill="#fce7f3" fillOpacity="0.8" />
        </g>
      </svg>

      {/* Flor espectral luminosa inferior derecha */}
      <svg
        className="absolute bottom-12 -right-12 w-72 h-72 sm:w-96 sm:h-96 opacity-40"
        viewBox="0 0 240 240"
        fill="none"
      >
        <defs>
          <radialGradient id="petalGlowRight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.04" />
          </radialGradient>
        </defs>
        <g transform="translate(120,120)">
          {[15, 75, 135, 195, 255, 315].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg})`}
              d="M0,0 C26,-38 36,-82 0,-112 C-36,-82 -26,-38 0,0 Z"
              fill="url(#petalGlowRight)"
              stroke="#e9d5ff"
              strokeWidth="0.8"
              strokeOpacity="0.45"
            />
          ))}
          <circle cx="0" cy="0" r="11" fill="#fae8ff" fillOpacity="0.85" />
        </g>
      </svg>

      {/* Silueta femenina etérea sutil en el lateral izquierdo (escritorio / tablet) */}
      <svg
        className="hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 w-28 h-56 opacity-25"
        viewBox="0 0 120 240"
        fill="none"
      >
        <path
          d="M65 28 C82 28 94 42 90 60 C87 74 78 82 82 94 C95 104 102 128 94 156 C86 184 62 204 42 222 C48 192 44 166 36 144 C26 118 34 94 46 84 C40 70 44 28 65 28 Z"
          fill="url(#petalGlowLeft)"
        />
        <text x="52" y="22" fill="#f9a8d4" fontSize="18" opacity="0.8">
          ♀
        </text>
      </svg>

      {/* Destellos y estrellas flotantes */}
      {[
        { top: '12%', left: '18%', size: 14 },
        { top: '22%', left: '84%', size: 18 },
        { top: '44%', left: '10%', size: 12 },
        { top: '64%', left: '88%', size: 15 },
        { top: '78%', left: '16%', size: 16 },
        { top: '86%', left: '72%', size: 12 },
      ].map((star, idx) => (
        <svg
          key={idx}
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          className="absolute text-pink-200 opacity-70 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z" />
        </svg>
      ))}
    </div>
  );
};
