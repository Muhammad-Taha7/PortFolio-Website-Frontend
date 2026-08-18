import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Maximize2, X, ExternalLink, 
  GitBranch, ArrowLeft, Calendar, Layers, Sparkles 
} from 'lucide-react';

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/projects`);
        if (response.ok) {
          const data = await response.json();
          const found = data.find(p => p._id === id);
          setProject(found || null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, BACKEND_URL]);

  const images = project?.images && project.images.length > 0 ? project.images : [];

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation for carousel and lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  // Description formatted renderer
  const renderFormattedDescription = (description) => {
    if (!description) return null;
    const lines = description.split('\n');

    return (
      <div className="space-y-6 text-gray-300">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          if (trimmed.endsWith(':') || trimmed.startsWith('#')) {
            const cleanTitle = trimmed.replace(/^#+\s*/, '');
            return (
              <h3 key={index} className="text-xl font-bold text-white pt-4 pb-1 border-b border-white/10">
                {cleanTitle}
              </h3>
            );
          }

          const bulletMatch = trimmed.match(/^[-•*]\s*(.*)/) || trimmed.match(/^(\d+\.)\s*(.*)/);
          if (bulletMatch) {
            const content = bulletMatch[2] || bulletMatch[1];
            return (
              <div key={index} className="flex items-start gap-4 pl-2 group">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></span>
                <p className="text-base md:text-lg leading-relaxed text-gray-300">
                  {content}
                </p>
              </div>
            );
          }

          return (
            <p key={index} className="text-base md:text-lg leading-relaxed text-gray-300 font-normal">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/60">
          <span className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm font-medium tracking-wide">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 mb-2">
          <Layers size={36} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Project Not Found</h2>
        <p className="text-gray-400 max-w-md text-sm">
          The requested project might have been moved or removed.
        </p>
        <Link 
          to="/Projects" 
          className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <ArrowLeft size={18} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-orange-500 selection:text-white pt-24 pb-20">

      {/* ===== TOP PROJECT CAROUSEL SECTION ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link 
            to="/Projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="flex items-center gap-3">
            {images.length > 0 && (
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-orange-500/20 hover:border-orange-500/40 border border-white/10 rounded-full text-white/80 hover:text-orange-400 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                <Maximize2 size={13} />
                Fullscreen
              </button>
            )}
          </div>
        </div>

        {/* Carousel Frame */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] bg-[#0f0f11] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/carousel">
          
          {images.length > 0 ? (
            <>
              {/* Main Display Image */}
              <div className="w-full h-full relative overflow-hidden bg-black/40 flex items-center justify-center">
                <img
                  src={getImageUrl(images[activeImage])}
                  alt={`${project.name} - slide ${activeImage + 1}`}
                  className="w-full h-full object-contain md:object-cover transition-all duration-500 ease-out"
                />
                
                {/* Subtle gradient vignette for overlay contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
              </div>

              {/* Prev / Next Slide Arrow Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-80 sm:opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl cursor-pointer z-20"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/15 flex items-center justify-center opacity-80 sm:opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl cursor-pointer z-20"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Carousel Bottom Control Bar: Counter + Thumbnail Pills */}
              <div className="absolute bottom-4 inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 pointer-events-none">
                
                {/* Image Counter Badge */}
                <div className="pointer-events-auto px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white/90 shadow-lg">
                  {String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>

                {/* Thumbnails Mini Strip */}
                {images.length > 1 && (
                  <div className="pointer-events-auto flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 max-w-full overflow-x-auto shadow-lg">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(idx)}
                        className={`relative h-10 w-14 sm:h-12 sm:w-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                          activeImage === idx
                            ? 'border-orange-500 scale-105 shadow-md shadow-orange-500/30'
                            : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                        }`}
                        aria-label={`View slide ${idx + 1}`}
                      >
                        <img 
                          src={getImageUrl(img)} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3">
              <Layers size={48} className="opacity-40" />
              <p className="text-sm font-medium">No screenshots uploaded for this project</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== PROJECT DETAILS & CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Main Content: Title, Badges & Formatted Description */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs">
                  Featured Showcase
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                {project.name}
              </h1>

              {/* Technologies Badges */}
              {project.technologies && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {(Array.isArray(project.technologies) 
                    ? project.technologies 
                    : project.technologies.split(',')
                  ).map((tech, idx) => {
                    const cleanTech = tech.trim();
                    if (!cleanTech) return null;
                    return (
                      <span 
                        key={idx} 
                        className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full"
                      >
                        {cleanTech}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={18} className="text-orange-500" />
                <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                  About the Project
                </h2>
              </div>
              
              {renderFormattedDescription(project.description)}
            </div>

          </div>

          {/* Right Sidebar: Actions & Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">

              {/* Action Links Box */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-4">
                  Project Links
                </h3>

                {project.liveLink && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}

                {project.githubLink && (
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <GitBranch size={18} />
                    Source Code
                  </a>
                )}

                {!project.liveLink && !project.githubLink && (
                  <p className="text-gray-500 text-xs text-center py-2">
                    Direct repository & demo links are unavailable for this project.
                  </p>
                )}
              </div>

              {/* Technologies Box */}
              {project.technologies && (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-4">
                    Tech Stack & Tools
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {(Array.isArray(project.technologies) 
                      ? project.technologies 
                      : project.technologies.split(',')
                    ).map((tech, idx) => {
                      const clean = tech.trim();
                      if (!clean) return null;
                      return (
                        <span 
                          key={idx} 
                          className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl"
                        >
                          {clean}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Publish Info Box */}
              {project.createdAt && (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Release Date</h4>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* ===== FULLSCREEN LIGHTBOX MODAL ===== */}
      {isLightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-7xl max-h-[85vh] w-full flex items-center justify-center">
            <img 
              src={getImageUrl(images[activeImage])} 
              alt="Fullscreen Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-6 mt-6">
              <button 
                type="button"
                onClick={handlePrev}
                className="px-5 py-2 bg-white/10 hover:bg-orange-500 rounded-full text-sm font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-xs font-mono font-bold text-gray-400 tracking-widest">
                {activeImage + 1} / {images.length}
              </span>
              <button 
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-white/10 hover:bg-orange-500 rounded-full text-sm font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};