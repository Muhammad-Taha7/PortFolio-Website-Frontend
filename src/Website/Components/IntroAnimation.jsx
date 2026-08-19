import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const IntroAnimation = ({ children }) => {
  const container = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorTextRef = useRef(null);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Inject Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Alkatra&family=Anton&family=Jost&family=Lexend&family=Nova+Oval&family=Oswald&family=PT+Serif&family=Poppins&family=Titillium+Web&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    let ctx = gsap.context(() => {
      // 1. Initial Position Setup
      gsap.set([cursorDotRef.current, cursorRingRef.current], { 
        xPercent: -50, 
        yPercent: -50,
        opacity: 1 
      });

      // Physics & Velocity State Tracking
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const mouse = { x: pos.x, y: pos.y };
      let isHovered = false;

      // Ultra Fast GSAP QuickSetters
      const setXDot = gsap.quickSetter(cursorDotRef.current, "x", "px");
      const setYDot = gsap.quickSetter(cursorDotRef.current, "y", "px");

      const setXRing = gsap.quickSetter(cursorRingRef.current, "x", "px");
      const setYRing = gsap.quickSetter(cursorRingRef.current, "y", "px");
      const setRotRing = gsap.quickSetter(cursorRingRef.current, "rotation", "deg");
      const setScaleXRing = gsap.quickSetter(cursorRingRef.current, "scaleX");
      const setScaleYRing = gsap.quickSetter(cursorRingRef.current, "scaleY");

      // 2. Intro Animation Timeline
      const introTL = gsap.timeline({
        paused: true,
        onComplete: () => setIntroFinished(true)
      });

      const fonts = ["Anton", "Jost", "Alkatra", "Nova Oval", "Oswald", "PT Serif", "Lexend", "Poppins", "Titillium Web"];
      fonts.forEach((font) => {
        introTL.to(".intro-text", { duration: 0.3, fontFamily: font, ease: "none" });
      });

      introTL.to(".intro-text", { duration: 0.3, scale: 0.8, opacity: 0, ease: "power2.in" })
        .to(".intro-bg", { duration: 0.8, scaleY: 0, ease: "expo.inOut" }, "-=0.1")
        .to(".intro__red", { duration: 0.8, scaleY: 0, ease: "expo.inOut" }, "-=0.7")
        .fromTo(".main-content-wrapper", 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" }, 
          "-=0.4"
        );

      const startAnimation = () => introTL.play();
      if (document.readyState === 'complete') startAnimation();
      else window.addEventListener('load', startAnimation);

      // 3. Mouse Coordinates Capture
      const handleMouseMove = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Instant Core Dot Tracking
        setXDot(mouse.x);
        setYDot(mouse.y);
      };

      // 4. Kinetic Velocity & Inertia Ticker Engine
      const renderPhysics = () => {
        // Smooth Inertia Lerp
        const dt = 0.15;
        const dx = mouse.x - pos.x;
        const dy = mouse.y - pos.y;

        pos.x += dx * dt;
        pos.y += dy * dt;

        setXRing(pos.x);
        setYRing(pos.y);

        // Velocity Stretch Calculations (Only when not hovering interactive elements)
        if (!isHovered) {
          const vx = dx * dt;
          const vy = dy * dt;
          const velocity = Math.sqrt(vx * vx + vy * vy);
          const angle = Math.atan2(vy, vx) * (180 / Math.PI);

          const stretch = Math.min(velocity * 0.045, 0.85);
          const scaleX = 1 + stretch;
          const scaleY = Math.max(1 - stretch * 0.6, 0.45);

          setRotRing(angle);
          setScaleXRing(scaleX);
          setScaleYRing(scaleY);
        }
      };

      gsap.ticker.add(renderPhysics);

      // 5. Interactive Magnetic Hover Morphing
      const handleMouseOver = (e) => {
        const target = e.target;
        if (target.closest('a, button, input, textarea, select, .clickable')) {
          isHovered = true;

          // Expand into Glassmorphic Interactive Badge
          gsap.to(cursorRingRef.current, {
            rotation: 0,
            scaleX: 1.6,
            scaleY: 1.6,
            borderRadius: "16px",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderColor: "#f97316",
            backdropFilter: "blur(6px)",
            duration: 0.35,
            ease: "back.out(1.7)"
          });

          // Hide Inner Dot & Reveal Badge Text
          gsap.to(cursorDotRef.current, { scale: 0, opacity: 0, duration: 0.2 });
          gsap.to(cursorTextRef.current, { opacity: 1, scale: 1, duration: 0.25 });
        }
      };

      const handleMouseOut = (e) => {
        const target = e.target;
        if (target.closest('a, button, input, textarea, select, .clickable')) {
          isHovered = false;

          gsap.to(cursorRingRef.current, {
            scaleX: 1,
            scaleY: 1,
            borderRadius: "9999px",
            backgroundColor: "rgba(249, 115, 22, 0.03)",
            borderColor: "rgba(249, 115, 22, 0.6)",
            backdropFilter: "blur(0px)",
            duration: 0.3,
            ease: "power2.out"
          });

          gsap.to(cursorDotRef.current, { scale: 1, opacity: 1, duration: 0.25 });
          gsap.to(cursorTextRef.current, { opacity: 0, scale: 0.5, duration: 0.15 });
        }
      };

      // Mouse Down / Up Bounce Elastic Physics
      const handleMouseDown = () => {
        gsap.to(cursorRingRef.current, { scale: 0.6, duration: 0.15 });
        gsap.to(cursorDotRef.current, { scale: 1.8, duration: 0.15 });
      };

      const handleMouseUp = () => {
        gsap.to(cursorRingRef.current, { scale: 1, duration: 0.4, ease: "elastic.out(1.2, 0.4)" });
        gsap.to(cursorDotRef.current, { scale: 1, duration: 0.25 });
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        gsap.ticker.remove(renderPhysics);
        window.removeEventListener('load', startAnimation);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
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

      {/* Unique Kinetic Fluid Custom Cursor */}
      <div className="hidden lg:block pointer-events-none select-none">
        {/* Core Laser Pointer Dot */}
        <div 
          ref={cursorDotRef}
          className="fixed top-0 left-0 w-3 h-3 bg-orange-500 rounded-full z-[10002] pointer-events-none shadow-[0_0_10px_#f97316]"
        />

        {/* Velocity Liquid Stretch & Dynamic Glass Badge Ring */}
        <div 
          ref={cursorRingRef}
          className="fixed top-0 left-0 w-12 h-12 rounded-full z-[10000] pointer-events-none border-2 border-orange-500/60 bg-orange-500/[0.03] flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.15)] origin-center"
        >
          {/* Subtle Hover Action Icon/Text */}
          <span 
            ref={cursorTextRef} 
            className="opacity-0 scale-50 text-[10px] font-extrabold text-orange-400 uppercase tracking-widest pointer-events-none"
          >
            ✦
          </span>
        </div>
      </div>

    </div>
  );
};

export default IntroAnimation;