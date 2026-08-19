import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function map(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

const IntroAnimation = ({ children }) => {
  const container = useRef(null);
  const ghostRef = useRef(null);
  const ghostEyesRef = useRef(null);
  const ghostMouthRef = useRef(null);

  const [counter, setCounter] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING ENVIRONMENT...');

  // Always start with false so animation triggers on every full page refresh
  const [introFinished, setIntroFinished] = useState(false);

  const finishIntro = () => {
    setIntroFinished(true);
  };

  useEffect(() => {
    // Inject Fonts dynamically for typography morphing
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@500;700;900&family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;700;800&family=Outfit:wght@700;900&family=Cinzel:wght@700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    let ctx = gsap.context(() => {
      // 1. Intro Animation Timeline (Scaled to 7.0s Complete Total Duration)
      if (!introFinished) {
        const countObj = { val: 0 };
        gsap.to(countObj, {
          val: 100,
          duration: 6.0,
          ease: "power2.inOut",
          onUpdate: () => {
            const currentVal = Math.floor(countObj.val);
            setCounter(currentVal);
            if (currentVal < 25) {
              setStatusText('INITIALIZING CORE MODULES...');
            } else if (currentVal < 55) {
              setStatusText('COMPILING CREATIVE ASSETS...');
            } else if (currentVal < 85) {
              setStatusText('RENDERING VISUAL INTERFACE...');
            } else {
              setStatusText('WELCOME TO THE EXPERIENCE');
            }
          }
        });

        const introTL = gsap.timeline({
          paused: false,
          onComplete: finishIntro
        });

        const dynamicFonts = [
          "'Space Grotesk', sans-serif", 
          "'Syne', sans-serif", 
          "'Cinzel', serif", 
          "'Outfit', sans-serif", 
          "'Anton', sans-serif", 
          "'JetBrains Mono', monospace"
        ];
        dynamicFonts.forEach((font, idx) => {
          introTL.to(".intro-brand-name", { 
            duration: 1.0, 
            fontFamily: font, 
            ease: "none" 
          }, idx * 1.0);
        });

        introTL.to(".intro-progress-bar", {
          width: "100%",
          duration: 6.0,
          ease: "power2.inOut"
        }, 0);

        introTL.to(".intro-center-hub", {
          scale: 1.06,
          opacity: 1,
          filter: "drop-shadow(0 0 35px rgba(255, 107, 0, 0.9))",
          duration: 0.3,
          ease: "power1.out"
        }, 6.0);

        introTL.to(".intro-elements", {
          opacity: 0,
          scale: 0.92,
          y: -15,
          duration: 0.3,
          ease: "power2.in"
        }, 6.2);

        introTL.to(".intro-shutter-top", {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut"
        }, 6.3);

        introTL.to(".intro-shutter-bottom", {
          yPercent: 100,
          duration: 0.7,
          ease: "power4.inOut"
        }, 6.3);

        introTL.to(".intro-laser-line", {
          scaleX: 1.5,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        }, 6.2);

        introTL.fromTo(".main-content-wrapper", 
          { opacity: 0, scale: 0.98 }, 
          { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", clearProps: "transform" }, 
          6.4
        );
      }

      // Safety fallback: Ensure intro dismisses at 7.1 seconds
      const safetyTimeout = setTimeout(() => {
        finishIntro();
      }, 7100);

      // 2. Ghost Cursor Physics Follower Engine
      const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };
      let clicked = false;
      const ghostPos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };

      const handleMouseMove = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      const handleMouseDown = () => {
        clicked = true;
      };

      const handleMouseUp = () => {
        clicked = false;
      };

      let rafId;
      const renderGhost = () => {
        if (ghostRef.current && ghostEyesRef.current && ghostMouthRef.current) {
          const targetX = mouse.x + 18;
          const targetY = mouse.y + 18;
          const distX = targetX - ghostPos.x;
          const distY = targetY - ghostPos.y;

          const velX = distX / 8;
          const velY = distY / 8;

          ghostPos.x += distX / 10;
          ghostPos.y += distY / 10;

          const skewX = map(velX, 0, 100, 0, -50);
          const scaleY = map(velY, 0, 100, 1, 2.0);
          let scaleEyeX = map(Math.abs(velX), 0, 100, 1, 1.2);
          let scaleEyeY = map(Math.abs(velX * 2), 0, 100, 1, 0.1);
          let scaleMouth = Math.min(
            Math.max(map(Math.abs(velX * 1.5), 0, 100, 0, 10), map(Math.abs(velY * 1.2), 0, 100, 0, 5)),
            2
          );

          if (clicked) {
            scaleEyeY = 0.4;
            scaleMouth = -scaleMouth;
          }

          ghostRef.current.style.transform = `translate(${ghostPos.x}px, ${ghostPos.y}px) scale(.65) skew(${skewX}deg) rotate(${-skewX}deg) scaleY(${scaleY})`;
          ghostEyesRef.current.style.transform = `translateX(-50%) scale(${scaleEyeX}, ${scaleEyeY})`;
          ghostMouthRef.current.style.transform = `translate(${-skewX * 0.5 - 10}px) scale(${scaleMouth})`;
        }

        rafId = requestAnimationFrame(renderGhost);
      };

      rafId = requestAnimationFrame(renderGhost);

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        clearTimeout(safetyTimeout);
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, container);

    // Smooth Scroll initialization with Lenis
    let lenisInstance;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        lerp: 0.08,
        smooth: true,
        smoothTouch: false,
      });

      function raf(time) {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    return () => {
      ctx.revert();
      if (lenisInstance) lenisInstance.destroy();
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  return (
    <div ref={container} className={`relative w-full min-h-screen bg-[#070709] ${!introFinished ? 'overflow-hidden h-screen' : ''}`}>
      
      {!introFinished && (
        <div className="fixed inset-0 z-[99999] select-none pointer-events-auto overflow-hidden bg-[#070709]">
          
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(249,115,22,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.08) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />

          <div className="intro-shutter-top absolute top-0 left-0 w-full h-1/2 bg-[#070709] z-20 border-b border-orange-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.9)] origin-top transform will-change-transform flex items-end justify-center overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-orange-600/15 via-orange-500/5 to-transparent rounded-full blur-[110px] pointer-events-none"></div>
          </div>

          <div className="intro-shutter-bottom absolute bottom-0 left-0 w-full h-1/2 bg-[#070709] z-20 border-t border-orange-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] origin-bottom transform will-change-transform flex items-start justify-center overflow-hidden">
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-orange-600/15 via-amber-500/5 to-transparent rounded-full blur-[110px] pointer-events-none"></div>
          </div>

          <div className="intro-laser-line absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent z-30 shadow-[0_0_15px_#ff6b00,0_0_30px_#ff8c00] -translate-y-1/2 pointer-events-none"></div>

          <div className="intro-elements absolute inset-0 z-40 flex flex-col items-center justify-between py-10 px-6 pointer-events-none">
            
            <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono tracking-widest text-neutral-400">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                </span>
              </div>
             
            </div>

            <div className="intro-center-hub flex flex-col items-center justify-center text-center my-auto relative">
              
              <div className="absolute w-[350px] sm:w-[520px] h-[350px] sm:h-[520px] bg-gradient-to-tr from-orange-600/25 via-amber-500/20 to-orange-700/10 rounded-full blur-[90px] -z-10 animate-pulse pointer-events-none"></div>

              <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-orange-500/40 animate-[spin_12s_linear_infinite]"></div>
                <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 via-black to-orange-950/40 border border-orange-500/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(255,107,0,0.35)] rotate-45">
                  <span className="-rotate-45 text-orange-400 font-mono font-black text-xl sm:text-2xl drop-shadow-[0_0_10px_#ff6b00]">
                    &lt;/&gt;
                  </span>
                </div>
              </div>

              <h1 className="intro-brand-name text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-orange-400 to-amber-500 drop-shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all duration-300">
                MUHAMMAD TAHA
              </h1>

              <div className="mt-4 sm:mt-5 flex items-baseline justify-center gap-1 font-mono">
                <span className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-200 to-orange-500 drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]">
                  {String(counter).padStart(2, '0')}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-orange-500 drop-shadow-[0_0_10px_#ff6b00]">
                  %
                </span>
              </div>

              <div className="w-64 sm:w-80 md:w-96 h-2 bg-neutral-900/90 rounded-full mt-7 p-0.5 border border-orange-500/30 overflow-hidden relative shadow-[0_0_20px_rgba(255,107,0,0.2)]">
                <div 
                  className="intro-progress-bar h-full rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 shadow-[0_0_12px_#ff6b00] relative"
                  style={{ width: '0%' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#ffffff,0_0_15px_#ff8c00]"></div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 text-xs font-mono font-bold tracking-[0.25em] text-orange-400/90 uppercase">
                <span>{statusText}</span>
              </div>

            </div>

    

          </div>

        </div>
      )}

      <div className={`main-content-wrapper w-full relative z-10 transition-opacity duration-500 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>

      <div className="hidden lg:block pointer-events-none select-none">
        <div id="ghost" ref={ghostRef} className="ghost">
          <div className="ghost__head">
            <div ref={ghostEyesRef} className="ghost__eyes"></div>
            <div ref={ghostMouthRef} className="ghost__mouth"></div>
          </div>
          <div className="ghost__tail">
            <div className="ghost__rip"></div>
          </div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="fixed w-0 h-0 pointer-events-none opacity-0">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="ghost-blur" />
              <feColorMatrix
                in="ghost-blur"
                mode="matrix"
                values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 16 -7"
                result="ghost-gooey"
              />
            </filter>
          </defs>
        </svg>
      </div>

    </div>
  );
};

export default IntroAnimation;