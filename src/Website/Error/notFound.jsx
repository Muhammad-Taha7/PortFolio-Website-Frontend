import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Glow Effect / Backdrop */}
      <div className="absolute inset-0  pointer-events-none" />

      <div className="relative z-10 w-full max-w-md md:max-w-2xl p-8 md:p-20  bg-zinc-900/40 backdrop-blur-md shadow-2xl">
        
        {/* 404 text ko PC par 'md:text-[15rem]' (bohot bada) kar diya hai */}
        <h1 className="text-9xl md:text-[18rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-700 opacity-90 select-none leading-none">
          404
        </h1>
        
        <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
          {/* Main heading size increased to md:text-4xl */}
          <h2 className="text-xl md:text-4xl font-bold tracking-tight text-zinc-100">
            Lost in the dark?
          </h2>
          {/* Description text size increased to md:text-lg */}
          <p className="text-sm md:text-lg text-zinc-400 max-w-xs md:max-w-xl mx-auto leading-relaxed">
            The page you are looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Button ko aur bada aur visual weight diya hai */}
        <div className="mt-10 md:mt-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 text-sm md:text-lg font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-50 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all duration-200 active:scale-95"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
