import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const IntroAnimation = ({ children }) => {
  const container = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Inject Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Alkatra&family=Anton&family=Jost&family=Lexend&family=Nova+Oval&family=Oswald&family=PT+Serif&family=Poppins&family=Titillium+Web&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    let ctx = gsap.context(() => {
      // Set initial cursor states so they are instantly visible
      if (cursorDotRef.current && cursorRingRef.current) {
        gsap.set([cursorDotRef.current, cursorRingRef.current], { 
          xPercent: -50, 
          yPercent: -50,
          opacity: 1 
        });
      }

      // 1. Intro Timeline setup (Total time ~4.0 seconds)
      const introTL = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIntroFinished(true);
        }
      });

      // Font Cycle Animation (~2.7s)
      const fonts = ["Anton", "Jost", "Alkatra", "Nova Oval", "Oswald", "PT Serif", "Lexend", "Poppins", "Titillium Web"];
      fonts.forEach((font) => {
        introTL.to(".intro-text", { 
          duration: 0.3, 
          fontFamily: font, 
          ease: "none" 
        });
      });

      // Reveal Outro Curtain (Completes at 4.0s)
      introTL.to(".intro-text", {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        ease: "power2.in"
      })
      .to(".intro-bg", { 
        duration: 0.8, 
        scaleY: 0, 
        ease: "expo.inOut" 
      }, "-=0.1")
      .to(".intro__red", { 
        duration: 0.8, 
        scaleY: 0, 
        ease: "expo.inOut" 
      }, "-=0.7")
      .fromTo(".main-content-wrapper", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" }, 
        "-=0.4"
      );

      const startAnimation = () => {
        introTL.play();
      };

      if (document.readyState === 'complete') {
        startAnimation();
      } else {
        window.addEventListener('load', startAnimation);
      }

      // 2. Custom Cursor Movement Physics
      const handleMouseMove = (e) => {
        const { clientX: x, clientY: y } = e;

        // Fast Dot Movement
        gsap.to(cursorDotRef.current, {
          x,
          y,
          duration: 0.1,
          ease: "power2.out",
          overwrite: "auto"
        });

        // Smooth Ring Trailing
        gsap.to(cursorRingRef.current, {
          x,
          y,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto"
        });
      };

      // Interactive Hover Effects
      const handleMouseOver = (e) => {
        const target = e.target;
        if (target.closest('a, button, input, textarea, select, .clickable')) {
          gsap.to(cursorRingRef.current, {
            scale: 2,
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderColor: "#f97316",
            duration: 0.25,
            ease: "power2.out"
          });
          gsap.to(cursorDotRef.current, {
            scale: 1.5,
            backgroundColor: "#f97316",
            duration: 0.25
          });
        }
      };

      const handleMouseOut = (e) => {
        const target = e.target;
        if (target.closest('a, button, input, textarea, select, .clickable')) {
          gsap.to(cursorRingRef.current, {
            scale: 1,
            backgroundColor: "transparent",
            borderColor: "#f97316",
            duration: 0.25,
            ease: "power2.out"
          });
          gsap.to(cursorDotRef.current, {
            scale: 1,
            backgroundColor: "#f97316",
            duration: 0.25
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);

      return () => {
        window.removeEventListener('load', startAnimation);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
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
    <div ref={container} className={`relative w-full min-h-screen lg:cursor-none ${!introFinished ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* Intro Overlay */}
      {!introFinished && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="intro__red absolute inset-0 bg-red-600 origin-top transform"></div>
          <div className="intro-bg absolute inset-0 bg-[#0f172a] flex items-center justify-center origin-bottom transform">
            <span className="intro-text text-[9vw] text-white font-bold uppercase tracking-wider select-none">
              Loading
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content-wrapper w-full relative z-10 opacity-0">
        {children}
      </div>

      {/* Custom Cursor Markup */}
      <div className="hidden lg:block pointer-events-none">
        {/* Inner Precision Dot */}
        <div 
          ref={cursorDotRef}
          className="fixed top-0 left-0 w-3 h-3 bg-orange-500 rounded-full z-[10001] pointer-events-none shadow-[0_0_10px_#f97316]"
        />

        {/* Outer Trailing Ring */}
        <div 
          ref={cursorRingRef}
          className="fixed top-0 left-0 w-10 h-10 border-2 border-orange-500 rounded-full z-[10000] pointer-events-none transition-colors duration-150"
        />
      </div>

    </div>
  );
};

export default IntroAnimation;