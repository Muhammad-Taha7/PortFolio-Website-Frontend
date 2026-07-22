import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const IntroAnimation = ({ children }) => {
  const container = useRef(null);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Inject Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Alkatra&family=Anton&family=Jost&family=Lexend&family=Nova+Oval&family=Oswald&family=PT+Serif&family=Poppins&family=Titillium+Web&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    let ctx = gsap.context(() => {
      // Intro Timeline
      const introTL = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIntroFinished(true);
        }
      });

      // Font Changing Section
      introTL.to(".intro-text", { duration: 0.15, fontFamily: "Anton" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Jost" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Alkatra" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Nova Oval" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Oswald" })
             .to(".intro-text", { duration: 0.15, fontFamily: "PT Serif" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Lexend" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Poppins" })
             .to(".intro-text", { duration: 0.15, fontFamily: "Titillium Web" });

      // Outro Screen Sliding
      introTL.to(".intro-bg", { duration: 1, scaleY: 0, ease: "expo.inOut" })
             .to(".intro__red", { duration: 1, scaleY: 0, ease: "expo.inOut" }, "-=0.85");

      // Animate Main Content In Smoothly
      introTL.fromTo(".main-content-wrapper", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform" }, 
        "-=0.4"
      );

      // Custom Cursor Logic
      const startAnimation = () => {
        introTL.play();
      };

      if (document.readyState === 'complete') {
        startAnimation();
      } else {
        window.addEventListener('load', startAnimation);
      }

      const handleMouseMove = (e) => {
        gsap.to(".cursor", { duration: 0.3, x: e.clientX, y: e.clientY, overwrite: "auto" });
      };
      const handleMouseEnter = () => {
        gsap.to(".cursor", { duration: 0.3, scale: 1, ease: "power2.out" });
      };
      const handleMouseLeave = () => {
        gsap.to(".cursor", { duration: 0.3, scale: 0, ease: "power2.out" });
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mouseenter", handleMouseEnter);
      document.body.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener('load', startAnimation);
        window.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseenter", handleMouseEnter);
        document.body.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, container);

    // Initialize Lenis Smooth Scrolling
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        lerp: 0.1,
        smooth: true,
        smoothTouch: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      ctx.add(() => {
        return () => {
          lenis.destroy();
        }
      });
    });

    return () => {
      ctx.revert();
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  return (
    <div ref={container} className={`relative w-full min-h-screen lg:cursor-none ${!introFinished ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* Intro Overlay (DOM se tabhi hatega jab full animation close ho jaye) */}
      {!introFinished && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="intro__red absolute inset-0 bg-red-600 origin-top transform"></div>
          <div className="intro-bg absolute inset-0 bg-[#e0e0e0] flex items-center justify-center origin-bottom transform">
            <span className="intro-text text-[10vw] text-black font-bold uppercase execution-loaded">
              Loading
            </span>
          </div>
        </div>
      )}

      {/* Main Content (Initially hidden, GSAP handles its entry) */}
      <div className="main-content-wrapper w-full relative z-10 opacity-0">
        {children}
      </div>

      {/* Custom Cursor (Visible only on PC/Large screens) */}
      <div className="cursor hidden lg:flex fixed top-0 left-0 w-20 h-20 bg-white rounded-full mix-blend-difference pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center">
        <span className="text-black font-bold text-xs tracking-widest uppercase">Explore</span>
      </div>
    </div>
  );
};

export default IntroAnimation;
