import React from "react";

export const  NotFound = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b12] flex items-center justify-center px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatX {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .orb-1 { animation: floatY 6s ease-in-out infinite, pulseGlow 5s ease-in-out infinite; }
        .orb-2 { animation: floatX 8s ease-in-out infinite, pulseGlow 6s ease-in-out infinite 1s; }
        .orb-3 { animation: floatY 7s ease-in-out infinite 0.5s; }
        .compass { animation: spinSlow 14s linear infinite; transform-origin: center; }
        .robot { animation: bob 3.2s ease-in-out infinite; transform-origin: center; }
        .eye-blink { animation: blink 3.5s ease-in-out infinite; transform-origin: center; }
        .path-dash {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: dash 2.4s ease-out forwards;
        }
        .shakey:hover { animation: shake 0.5s ease-in-out; }
        .shimmer-text {
          background: linear-gradient(90deg, #f5c451 0%, #fff5d6 25%, #f5c451 50%, #ffb347 75%, #f5c451 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      {/* Ambient gradient orbs */}
      <div className="orb-1 absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/30 via-amber-400/20 to-transparent blur-3xl" />
      <div className="orb-2 absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-purple-600/25 via-fuchsia-500/10 to-transparent blur-3xl" />
      <div className="orb-3 absolute top-1/3 right-10 w-64 h-64 rounded-full bg-gradient-to-bl from-orange-400/10 to-transparent blur-2xl" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full">
        <div className="glass rounded-3xl px-8 py-14 sm:px-16 sm:py-16 shadow-2xl text-center">
          {/* Robot + compass illustration */}
          <div className="relative flex items-center justify-center mb-6 h-40">
            {/* Compass ring, spinning */}
            <svg
              className="compass absolute w-40 h-40 opacity-70"
              viewBox="0 0 200 200"
              fill="none"
            >
              <circle
                cx="100"
                cy="100"
                r="86"
                stroke="url(#ringGrad)"
                strokeWidth="1.5"
                strokeDasharray="6 10"
              />
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="200" y2="200">
                  <stop offset="0%" stopColor="#f5c451" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path
                d="M100 30 L108 100 L100 170 L92 100 Z"
                fill="url(#ringGrad)"
                opacity="0.85"
              />
            </svg>

            {/* Lost robot */}
            <svg
              className="robot shakey relative w-24 h-24 cursor-pointer"
              viewBox="0 0 120 120"
              fill="none"
            >
              <rect
                x="30"
                y="42"
                width="60"
                height="50"
                rx="14"
                fill="#1a1a24"
                stroke="#f5c451"
                strokeWidth="2"
              />
              <rect x="50" y="20" width="20" height="22" rx="6" fill="#1a1a24" stroke="#f5c451" strokeWidth="2" />
              <circle cx="60" cy="16" r="5" fill="#f5c451" />
              <line x1="60" y1="21" x2="60" y2="24" stroke="#f5c451" strokeWidth="2" />

              <g className="eye-blink">
                <circle cx="48" cy="64" r="6" fill="#f5c451" />
                <circle cx="72" cy="64" r="6" fill="#f5c451" />
              </g>

              <path
                d="M48 80 Q60 72 72 80"
                stroke="#f5c451"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              <rect x="16" y="56" width="10" height="20" rx="5" fill="#f5c451" opacity="0.85" />
              <rect x="94" y="56" width="10" height="20" rx="5" fill="#f5c451" opacity="0.85" />

              <rect x="40" y="98" width="14" height="16" rx="4" fill="#1a1a24" stroke="#f5c451" strokeWidth="2" />
              <rect x="66" y="98" width="14" height="16" rx="4" fill="#1a1a24" stroke="#f5c451" strokeWidth="2" />
            </svg>

            {/* Question marks floating */}
            <svg className="absolute -top-2 left-6 w-6 h-6 orb-3" viewBox="0 0 24 24">
              <text x="0" y="18" fontSize="20" fill="#a855f7" fontFamily="Plus Jakarta Sans" fontWeight="700">
                ?
              </text>
            </svg>
            <svg className="absolute top-4 right-4 w-5 h-5 orb-1" viewBox="0 0 24 24">
              <text x="0" y="18" fontSize="16" fill="#f5c451" fontFamily="Plus Jakarta Sans" fontWeight="700">
                ?
              </text>
            </svg>
          </div>

          {/* Dashed path illustration */}
          <svg className="w-full h-10 mb-2 opacity-80" viewBox="0 0 300 40" fill="none">
            <path
              className="path-dash"
              d="M10 30 Q80 5 150 25 T290 15"
              stroke="url(#pathGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="300" y2="0">
                <stop offset="0%" stopColor="#f5c451" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          <h1 className="font-display shimmer-text text-7xl sm:text-8xl font-800 tracking-tight mb-2">
            404
          </h1>

          <h2 className="font-display text-white text-2xl sm:text-3xl font-semibold mb-3">
            Lost in the wrong direction
          </h2>

          <p className="font-body text-white/60 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            The page you're looking for doesn't exist, was moved, or is
            hiding somewhere off the map. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/"
              className="font-body group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#1a1108] font-semibold text-sm shadow-lg shadow-orange-500/20 transition-transform duration-300 hover:scale-105"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </a>

            <a
              href="javascript:history.back()"
              className="font-body inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-white/15 text-white/80 font-medium text-sm transition-colors duration-300 hover:bg-white/5 hover:text-white"
            >
              Go back
            </a>
          </div>

          <div className="font-body mt-10 pt-6 border-t border-white/10 text-white/30 text-xs tracking-wide">
            T.Dev
          </div>
        </div>
      </div>
    </div>
  );
}