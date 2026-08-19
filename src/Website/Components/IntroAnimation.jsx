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

  // Check if intro has already been shown in this tab session
  const [introFinished, setIntroFinished] = useState(() => {
    try {
      return sessionStorage.getItem('taha_portfolio_intro_seen') === 'true';
    } catch {
      return false;
    }
  });

  const finishIntro = () => {
    try {
      sessionStorage.setItem('taha_portfolio_intro_seen', 'true');
    } catch (e) {
      // ignore
    }
    setIntroFinished(true);
  };

  useEffect(() => {
    // Inject Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Alkatra&family=Anton&family=Jost&family=Lexend&family=Nova+Oval&family=Oswald&family=PT+Serif&family=Poppins&family=Titillium+Web&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    let ctx = gsap.context(() => {
      // 1. Intro Animation Timeline (Only if not already finished)
      if (!introFinished) {
        const introTL = gsap.timeline({
          paused: false,
          onComplete: finishIntro
        });

        const fonts = ["Anton", "Jost", "Alkatra", "Nova Oval", "Oswald", "PT Serif", "Lexend", "Poppins", "Titillium Web"];
        fonts.forEach((font) => {
          introTL.to(".intro-text", { duration: 0.28, fontFamily: font, ease: "none" });
        });

        introTL.to(".intro-text", { duration: 0.3, scale: 0.85, opacity: 0, ease: "power2.in" })
          .to(".intro-bg", { duration: 0.8, scaleY: 0, ease: "expo.inOut" }, "-=0.1")
          .to(".intro__accent", { duration: 0.8, scaleY: 0, ease: "expo.inOut" }, "-=0.7")
          .fromTo(".main-content-wrapper", 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" }, 
            "-=0.4"
          );
      }

      // Hard safety fallback: Ensure intro ALWAYS dismisses at 3.8 seconds
      const safetyTimeout = setTimeout(() => {
        finishIntro();
      }, 3800);

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
  }, [introFinished]);

  return (
    <div ref={container} className={`relative w-full min-h-screen ${!introFinished ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* Light Theme Intro Overlay */}
      {!introFinished && (
        <div className="fixed inset-0 z-[9999] select-none">
          {/* Secondary Accent Curtain */}
          <div className="intro__accent absolute inset-0 bg-gradient-to-b from-amber-200 via-orange-300 to-amber-400 origin-top transform"></div>
          
          {/* Main Light Background Layer */}
          <div className="intro-bg absolute inset-0 bg-[#f8fafc] flex flex-col items-center justify-center origin-bottom transform shadow-2xl">
            
            {/* Skip Button */}
            <button
              onClick={finishIntro}
              className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer pointer-events-auto border border-slate-300"
            >
              Skip ✕
            </button>

            {/* Ambient soft glow */}
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-amber-400/20 via-orange-300/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

            {/* Main Animated Text */}
            <span className="intro-text text-[9vw] text-[#0f172a] font-black uppercase tracking-wider select-none leading-none z-10 drop-shadow-sm">
              Loading
            </span>

            {/* Smooth 3.5s animated progress bar */}
            <div className="w-56 sm:w-72 h-1.5 bg-slate-200/80 rounded-full mt-7 overflow-hidden relative z-10 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                style={{
                  animation: 'loadingProgress 3.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}
              />
            </div>

            {/* Subtitle */}
            <div className="flex items-center gap-2 mt-3.5 z-10">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-slate-600 uppercase">
                INITIALIZING PORTFOLIO
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content (Always visible once introFinished is true) */}
      <div className={`main-content-wrapper w-full relative z-10 transition-opacity duration-500 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>

      {/* === GHOST CUSTOM CURSOR (SVG Gooey Filter & Ghost Container) === */}
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

        {/* SVG Gooey Filter */}
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