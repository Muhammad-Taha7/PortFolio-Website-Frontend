import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export const TopProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef(null);
  const draggableInstance = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/projects?featured=true`);
        if (response.ok) {
          const data = await response.json();
          setProjects([...data].reverse());
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [BACKEND_URL]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, projects.length - 1));
    }
  };

  const handleNext = () => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Fixed 3D Tilt + Interactive Glow Logic
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Mouse coordinates relative to card center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // Apply smooth GSAP 3D Tilt
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.2,
      overwrite: 'auto'
    });

    // Dynamic Radial Mouse Glow
    const glowElement = card.querySelector('.card-glow');
    if (glowElement) {
      glowElement.style.background = `radial-gradient(
        500px circle at ${x}px ${y}px,
        rgba(249, 115, 22, 0.25),
        transparent 50%
      )`;
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    
    // Reset Tilt Smoothly
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.5,
      overwrite: 'auto'
    });

    const glowElement = card.querySelector('.card-glow');
    if (glowElement) {
      glowElement.style.background = 'transparent';
    }
  };

  useEffect(() => {
    if (!sliderRef.current || projects.length === 0) return;

    const cardElement = sliderRef.current.querySelector('.tp-card-wrapper');
    const cardWidth = cardElement ? cardElement.offsetWidth : 280;
    const gap = 32;
    const step = cardWidth + gap;

    gsap.to(sliderRef.current, {
      x: -currentIndex * step,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    if (draggableInstance.current) {
      draggableInstance.current[0].kill();
    }

    draggableInstance.current = Draggable.create(sliderRef.current, {
      type: "x",
      edgeResistance: 0.75,
      bounds: {
        minX: -((projects.length - 1) * step),
        maxX: 0
      },
      onDragEnd: function () {
        const nearestIndex = Math.round(this.x / -step);
        const boundedIndex = Math.max(0, Math.min(projects.length - 1, nearestIndex));
        setCurrentIndex(boundedIndex);
      }
    });

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current[0].kill();
      }
    };
  }, [currentIndex, projects]);

  return (
    <div className="w-full bg-[#070707] py-20 md:py-28 overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Ambient Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs block mb-3">
              Featured Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Top Projects
            </h2>
            <div className="w-16 h-1 bg-orange-500 mt-4 rounded-full"></div>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] text-white flex items-center justify-center transition-colors duration-300 hover:bg-orange-500 hover:border-orange-500 active:scale-95 group shadow-lg"
                aria-label="Previous Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] text-white flex items-center justify-center transition-colors duration-300 hover:bg-orange-500 hover:border-orange-500 active:scale-95 group shadow-lg"
                aria-label="Next Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Cards Slider */}
        {loading ? (
          <div className="h-[450px] flex items-center justify-center">
            <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : projects.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-white/50 text-sm">
            No featured projects found.
          </div>
        ) : (
          <div className="relative w-full overflow-visible">
            <div className="w-full">
              <div
                ref={sliderRef}
                className="flex gap-8 cursor-grab active:cursor-grabbing select-none py-6"
                style={{ willChange: 'transform' }}
              >
                {projects.map((project, index) => {
                  const imgUrl = project.images && project.images.length > 0
                    ? (project.images[0].startsWith('http') ? project.images[0] : `${BACKEND_URL}${project.images[0].startsWith('/') ? '' : '/'}${project.images[0]}`)
                    : '/placeholder.jpg';

                  return (
                    <div
                      key={project._id || index}
                      className="tp-card-wrapper w-[280px] sm:w-[460px] shrink-0"
                      style={{ perspective: '1000px' }}
                    >
                      {/* Fixed 3D Tilt Card Container */}
                      <div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="group relative bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/70 transition-colors duration-300 flex flex-col h-[420px] sm:h-[560px] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                      >
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/20 blur-xl rounded-tl-2xl pointer-events-none group-hover:bg-orange-500/40 transition-colors duration-500" />
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500 rounded-tl-md pointer-events-none z-30 shadow-[0_0_8px_#f97316]" />

                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 blur-xl rounded-tr-2xl pointer-events-none group-hover:bg-orange-500/40 transition-colors duration-500" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500 rounded-tr-md pointer-events-none z-30 shadow-[0_0_8px_#f97316]" />

                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/20 blur-xl rounded-bl-2xl pointer-events-none group-hover:bg-orange-500/40 transition-colors duration-500" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl-md pointer-events-none z-30 shadow-[0_0_8px_#f97316]" />

                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/20 blur-xl rounded-br-2xl pointer-events-none group-hover:bg-orange-500/40 transition-colors duration-500" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br-md pointer-events-none z-30 shadow-[0_0_8px_#f97316]" />

                        {/* Radial Glow */}
                        <div className="card-glow pointer-events-none absolute inset-0 z-20 rounded-2xl" />

                        {/* Image Section */}
                        <div className="w-full h-[200px] sm:h-[320px] overflow-hidden relative bg-black/50 pointer-events-none shrink-0">
                          <img
                            src={imgUrl}
                            alt={project.name}
                            loading="eager"
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90 z-10"></div>
                        </div>

                        {/* Details Section */}
                        <div className="p-5 sm:p-7 flex flex-col justify-between flex-1 relative z-10 bg-[#111111]">
                          <div>
                            <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 line-clamp-1 group-hover:text-orange-400 transition-colors tracking-wide">
                              {project.name}
                            </h3>

                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                {project.technologies.slice(0, 4).map((tech, idx) => (
                                  <span key={idx} className="text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/5 text-neutral-300 border border-white/10 rounded-lg group-hover:border-orange-500/30 transition-colors">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <Link
                            to={`/project/${project._id}`}
                            className="inline-flex items-center justify-center w-full py-2.5 sm:py-3.5 px-4 sm:px-5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.5)] text-xs tracking-[0.15em] uppercase select-none rounded-xl relative z-30"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 sm:mt-16 flex justify-center">
          <Link
            to="/projects"
            className="group relative inline-flex items-center gap-3 px-9 py-4 bg-transparent border-2 border-orange-500/50 text-white text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95"
          >
            <span>View All Projects</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};