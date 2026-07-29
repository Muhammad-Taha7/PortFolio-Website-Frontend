import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Register GSAP Plugins
gsap.registerPlugin(Draggable);

export const TopProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const sliderRef = useRef(null);
  const draggableInstance = useRef(null);
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch featured projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/projects?featured=true`);
        if (response.ok) {
          const data = await response.json();
          // Projects ko reverse order me set kar rahe hain
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

  // Navigation handlers
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

  // Mouse tilt handlers
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  // GSAP Slide Animation + Drag Setup
  useEffect(() => {
    if (!sliderRef.current || projects.length === 0) return;

    const cardElement = sliderRef.current.querySelector('.tp-card-wrapper');
    const cardWidth = cardElement ? cardElement.offsetWidth : 380;
    const gap = 24; // gap-6 (24px)
    const step = cardWidth + gap;

    // Smooth Slide Transition
    gsap.to(sliderRef.current, {
      x: -currentIndex * step,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    // Clean old instance of draggable
    if (draggableInstance.current) {
      draggableInstance.current[0].kill();
    }

    // Initialize Grabber
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
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs block mb-3">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Top Projects
            </h2>
            <div className="w-16 h-1 bg-orange-500 mt-4 rounded-full"></div>
          </div>

          {/* Navigation Controls */}
          {projects.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-white flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 active:scale-95 group"
                aria-label="Previous Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>

              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-white flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 active:scale-95 group"
                aria-label="Next Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Slider Container */}
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <span className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
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
                className="flex gap-6 cursor-grab active:cursor-grabbing select-none py-4"
                style={{ willChange: 'transform' }}
              >
                {projects.map((project, index) => {
                  const imgUrl = project.images && project.images.length > 0
                    ? (project.images[0].startsWith('http') ? project.images[0] : `${BACKEND_URL}${project.images[0].startsWith('/') ? '' : '/'}${project.images[0]}`)
                    : '/placeholder.jpg';

                  return (
                    <div
                      key={project._id || index}
                      className="tp-card-wrapper w-[300px] sm:w-[380px] shrink-0"
                      style={{ perspective: '1000px' }}
                    >
                      {/* Tilt Card Container */}
                      <div 
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="group relative bg-[#111111] border border-white/10 overflow-hidden hover:border-orange-500/50 transition-colors duration-500 flex flex-col h-[440px] sm:h-[480px] shadow-2xl rounded-sm"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        
                        {/* Crisp Image Container */}
                        <div className="w-full h-[240px] sm:h-[280px] overflow-hidden relative bg-black/40">
                          <img
                            src={imgUrl}
                            alt={project.name}
                            loading="eager"
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80"></div>
                        </div>

                        {/* Card Info */}
                        <div className="p-6 flex flex-col justify-between flex-1 relative z-10 bg-[#111111]">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">
                              {project.name}
                            </h3>
                            
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.technologies.slice(0, 4).map((tech, idx) => (
                                  <span key={idx} className="text-[11px] font-medium px-2.5 py-0.5 bg-white/5 text-neutral-300 border border-white/10 rounded-xs">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action button */}
                          <Link
                            to={`/project/${project._id}`}
                            className="inline-flex items-center justify-center w-full py-3 px-4 bg-white/5 hover:bg-orange-500 text-white font-semibold transition-all duration-300 border border-white/10 hover:border-orange-500 text-xs tracking-wider uppercase select-none mt-2"
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

        {/* View All Projects Button */}
        <div className="mt-14 sm:mt-16 flex justify-center">
          <Link
            to="/projects"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-orange-500/40 text-white text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] active:scale-95"
          >
            <span>View All Projects</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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