import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WebsiteFooter = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const parallaxTextRef = useRef(null);
  const spotlightContainerRef = useRef(null);
  const spotlightGlowRef = useRef(null);
  const orangeMaskRef = useRef(null);

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/Projects' },
    { label: 'About', path: '/About' },
    { label: 'Contact', path: '/Contact' },
  ];

  const moreLinks = [
    { label: 'Blogs', path: '/Blogs' },
    { label: 'Testimonials', path: '/Testimonials' },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Smooth GSAP Scroll Parallax for the TAHA typography
      if (parallaxTextRef.current && footerRef.current) {
        gsap.fromTo(
          parallaxTextRef.current,
          { yPercent: -6, scale: 0.98 },
          {
            yPercent: 4,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.5,
            }
          }
        );
      }

      // 2. High-FPS 120Hz Mouse & Touch Spotlight Engine
      const container = spotlightContainerRef.current;
      const glow = spotlightGlowRef.current;
      const maskLayer = orangeMaskRef.current;

      if (!container || !glow || !maskLayer) return;

      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      let targetX = -1000;
      let targetY = -1000;
      let currentX = -1000;
      let currentY = -1000;
      let isInteracting = false;
      let animFrameId = null;
      let rect = container.getBoundingClientRect();

      const updateRect = () => {
        if (container) rect = container.getBoundingClientRect();
      };
      window.addEventListener('resize', updateRect, { passive: true });
      window.addEventListener('scroll', updateRect, { passive: true });

      // Mouse Move
      const handleMouseMove = (e) => {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        if (!isInteracting) {
          isInteracting = true;
          gsap.to(glow, { opacity: 1, duration: 0.3, overwrite: 'auto' });
          gsap.to(maskLayer, { opacity: 1, duration: 0.3, overwrite: 'auto' });
        }
      };

      const handleMouseLeave = () => {
        isInteracting = false;
        gsap.to(glow, { opacity: 0, duration: 0.6, overwrite: 'auto' });
        gsap.to(maskLayer, { opacity: 0, duration: 0.6, overwrite: 'auto' });
      };

      // Touch Events for Mobile / Tablet
      const handleTouchMove = (e) => {
        if (e.touches && e.touches[0]) {
          targetX = e.touches[0].clientX - rect.left;
          targetY = e.touches[0].clientY - rect.top;
          if (!isInteracting) {
            isInteracting = true;
            gsap.to(glow, { opacity: 1, duration: 0.25, overwrite: 'auto' });
            gsap.to(maskLayer, { opacity: 1, duration: 0.25, overwrite: 'auto' });
          }
        }
      };

      const handleTouchEnd = () => {
        isInteracting = false;
        gsap.to(glow, { opacity: 0, duration: 0.8, overwrite: 'auto' });
        gsap.to(maskLayer, { opacity: 0, duration: 0.8, overwrite: 'auto' });
      };

      // 3. Mobile / Ambient Idle Scroll Scanning (Automatic shine on scroll)
      let mobileScrollProgress = 0;
      if (footerRef.current) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top 85%',
          end: 'bottom 15%',
          onUpdate: (self) => {
            mobileScrollProgress = self.progress;
            // On mobile devices when not directly touching, auto-scan spotlight across the text
            if (isTouchDevice && !isInteracting) {
              const width = rect.width || window.innerWidth;
              const height = rect.height || 200;
              targetX = width * mobileScrollProgress;
              targetY = height * 0.5;
              
              // Fade in during scroll
              if (self.isActive && self.progress > 0.05 && self.progress < 0.95) {
                gsap.to(glow, { opacity: 0.8, duration: 0.4, overwrite: 'auto' });
                gsap.to(maskLayer, { opacity: 0.9, duration: 0.4, overwrite: 'auto' });
              } else {
                gsap.to(glow, { opacity: 0, duration: 0.6, overwrite: 'auto' });
                gsap.to(maskLayer, { opacity: 0, duration: 0.6, overwrite: 'auto' });
              }
            }
          }
        });
      }

      // Smooth Lerp Render Loop (Optimized for 60Hz - 120Hz Displays)
      const render = () => {
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;

        // GPU translate3d for max FPS
        glow.style.transform = `translate3d(${currentX - 200}px, ${currentY - 200}px, 0)`;

        // Mask radius adaptively scaled for mobile vs desktop
        const maskRadius = isTouchDevice ? '180px' : '230px';
        const maskGradient = `radial-gradient(${maskRadius} circle at ${currentX}px ${currentY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)`;
        maskLayer.style.webkitMaskImage = maskGradient;
        maskLayer.style.maskImage = maskGradient;

        animFrameId = requestAnimationFrame(render);
      };

      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      container.addEventListener('touchstart', handleTouchMove, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });

      animFrameId = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchstart', handleTouchMove);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        if (animFrameId) cancelAnimationFrame(animFrameId);
      };

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="bg-[#08080a] text-white relative overflow-hidden"
      style={{ fontFamily: "'Clarity City', sans-serif" }}
    >
      {/* Top Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-12 relative z-10">
        {/* Big CTA Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-20 pb-16 border-b border-white/10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
              Have an idea?
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Let's build something amazing together. Feel free to reach out for collaborations or just a friendly hello.
            </p>
          </div>
          <Link 
            to="/Contact" 
            className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all duration-300 uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] cursor-pointer"
          >
            Get In Touch
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="text-2xl font-black tracking-tight text-white hover:text-orange-500 transition-colors duration-300">
              MR.TAHA
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              A passionate MERN Stack Developer building digital web experiences that combine clean design, high performance, and seamless user experiences.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/mr-taha-b05849423/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/Muhammad-Taha7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: More + Contact */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500">More</h4>
            <ul className="space-y-3">
              {moreLinks.map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-500">Get In Touch</h4>
              <a 
                href="mailto:meet.tahadev@gmail.com" 
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm block truncate"
              >
                meet.tahadev@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HIGH-FPS LIQUID SPOTLIGHT MASKED TYPOGRAPHY ("TAHA") ===== */}
      <div 
        ref={spotlightContainerRef}
        className="relative w-full overflow-hidden select-none py-10 border-t border-white/5 flex items-center justify-center cursor-crosshair touch-none"
      >
        {/* Dynamic Smooth Orange Spotlight Glow Orb */}
        <div 
          ref={spotlightGlowRef}
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-0 z-0 will-change-transform"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 70%)' }}
        ></div>

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Wrapper for the Layers */}
        <div ref={parallaxTextRef} className="relative w-full text-center flex items-center justify-center">
          
          {/* LAYER 1 (Base Muted Stroke Layer - always visible) */}
          <div 
            className="w-full text-center whitespace-nowrap font-black uppercase tracking-tighter text-[22vw] md:text-[25vw] lg:text-[27vw] leading-[0.85] text-transparent select-none pointer-events-none"
            style={{
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.12)',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            TAHA
          </div>

          {/* LAYER 2 (Fiery Glowing Orange Mask Layer - illuminated strictly under cursor / touch / scroll wave) */}
          <div 
            ref={orangeMaskRef}
            className="absolute inset-0 w-full text-center whitespace-nowrap font-black uppercase tracking-tighter text-[22vw] md:text-[25vw] lg:text-[27vw] leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 drop-shadow-[0_0_35px_rgba(249,115,22,0.8)] opacity-0 select-none pointer-events-none will-change-transform"
            style={{
              WebkitTextStroke: '1.5px rgba(249, 115, 22, 0.9)',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            TAHA
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/5 relative z-10 bg-[#060608]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs tracking-wide">
            © {currentYear} MR.TAHA. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AVAILABLE FOR FREELANCE & FULL-TIME
          </div>
        </div>
      </div>
    </footer>
  );
};
