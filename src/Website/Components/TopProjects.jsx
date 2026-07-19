import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// GSAP Plugins register karna zaroori hai
gsap.registerPlugin(Draggable);

export const TopProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const sliderRef = useRef(null);
  const autoplayTimer = useRef(null);
  const draggableInstance = useRef(null);
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-nine.vercel.app";
  const AUTOPLAY_SPEED = 2000; // 2 seconds me automatic next hoga

  // Fetch featured projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/projects?featured=true`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Autoplay (Repeat Loop) Functionality
  const startAutoplay = () => {
    stopAutoplay();
    if (projects.length > 1) {
      autoplayTimer.current = setInterval(() => {
        handleNext();
      }, AUTOPLAY_SPEED);
    }
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [projects, currentIndex]); // Slide change ya project load hone par cycle smooth rakhega

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

  // GSAP Slide Animation + Drag Setup (Grabber)
  useEffect(() => {
    if (!sliderRef.current || projects.length === 0) return;

    const cardWidth = sliderRef.current.querySelector('.tp-card-wrapper')?.offsetWidth || 400;
    const gap = 24; // gap-6 (24px)
    const step = cardWidth + gap;

    // Smooth Slide Transition
    gsap.to(sliderRef.current, {
      x: -currentIndex * step,
      duration: 0.8,
      ease: 'power4.out',
      overwrite: 'auto'
    });

    // Clean old instance of draggable
    if (draggableInstance.current) {
      draggableInstance.current[0].kill();
    }

    // Initialize Grabber
    draggableInstance.current = Draggable.create(sliderRef.current, {
      type: "x",
      edgeResistance: 0.65,
      bounds: {
        minX: -((projects.length - 1) * step),
        maxX: 0
      },
      onDragStart: () => {
        stopAutoplay(); // Drag ke dauran auto-play pause ho jaye
      },
      onDragEnd: function () {
        // Nearest card calculate karke waha slide snap karega
        const nearestIndex = Math.round(this.x / -step);
        const boundedIndex = Math.max(0, Math.min(projects.length - 1, nearestIndex));
        
        setCurrentIndex(boundedIndex);
        startAutoplay(); // Drag end hone par autoplay resume
      }
    });

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current[0].kill();
      }
    };
  }, [currentIndex, projects]);

  return (
    <div className="w-full bg-[#070707] py-28 md:py-36 overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm block mb-4">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
              Top Projects
            </h2>
            <div className="w-20 h-1.5 bg-orange-500 mt-6 rounded-full"></div>
          </div>

          {/* Navigation Controls */}
          {projects.length > 0 && (
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white active:scale-95 group"
                aria-label="Previous Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5"><path d="m15 18-6-6 6-6" /></svg>
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white active:scale-95 group"
                aria-label="Next Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Slider Container */}
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : projects.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-white/50">
            No featured projects found.
          </div>
        ) : (
          <div className="relative w-full overflow-visible">
            <div className="w-full">
              <div
                ref={sliderRef}
                className="flex gap-6 cursor-grab active:cursor-grabbing select-none"
                style={{ willChange: 'transform' }}
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
              >
                {projects.map((project, index) => {
                  const imgUrl = project.images && project.images.length > 0
                    ? (project.images[0].startsWith('http') ? project.images[0] : `${BACKEND_URL}${project.images[0].startsWith('/') ? '' : '/'}${project.images[0]}`)
                    : '/placeholder.jpg';

                  return (
                    <div
                      key={project._id + index}
                      className="tp-card-wrapper w-[290px] sm:w-[400px] shrink-0"
                    >
                      {/* Premium Sharp-edged container (No Rounded classes) */}
                      <div className="group relative bg-white/[0.02] border border-white/5 overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col h-[500px] md:h-[650px] rounded-none">
                        
                        {/* Image Holder - Fills 65% height */}
                        <div className="w-full h-[65%] overflow-hidden relative pointer-events-none rounded-none">
                          <img
                            src={imgUrl}
                            alt={project.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] to-transparent opacity-60"></div>
                        </div>

                        {/* Card Info - Fills 35% height */}
                        <div className="p-6 flex flex-col justify-between h-[35%]">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                              {project.name}
                            </h3>
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                  <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 bg-white/5 text-gray-300 border border-white/10 rounded-none">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Sharp action button (rounded-none) */}
                          <Link
                            to={`/project/${project._id}`}
                            className="inline-flex items-center justify-center w-full py-3.5 px-4 bg-white/5 hover:bg-orange-500 text-white font-bold transition-all duration-300 border border-white/10 hover:border-orange-500 text-sm select-none rounded-none"
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
      </div>
    </div>
  );
};