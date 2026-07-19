import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-1jtz.vercel.app";

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
  }, [id]);

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" style={{ fontFamily: "'Clarity City', sans-serif" }}>
        <div className="flex items-center gap-3 text-white/50">
          <span className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6" style={{ fontFamily: "'Clarity City', sans-serif" }}>
        <h2 className="text-3xl font-bold text-white">Project Not Found</h2>
        <Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Clarity City', sans-serif" }}>

      {/* ===== FULL-WIDTH HERO IMAGE ===== */}
      <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
        <img
          src={getImageUrl(project.images?.[activeImage])}
          alt={project.name}
          className="w-full h-full object-cover transition-all duration-700"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent"></div>
        
        {/* Back Button */}
        <Link 
          to="/"
          className="absolute top-8 left-8 md:top-12 md:left-12 z-20 flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        {/* Hero Title Overlay - Full Width, Bottom Left */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 lg:px-16 pb-12 md:pb-20 z-10">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs mb-4">
            Project Case Study
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] max-w-4xl">
            {project.name}
          </h1>
          
          {/* Quick Tech Tags under title */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-6">
              {project.technologies.map(tech => (
                <span 
                  key={tech} 
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image Counter - Bottom Right */}
        {project.images && project.images.length > 1 && (
          <div className="absolute bottom-12 md:bottom-20 right-8 md:right-12 lg:right-16 z-10 flex items-center gap-4">
            <button
              onClick={() => setActiveImage(prev => Math.max(0, prev - 1))}
              disabled={activeImage === 0}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-bold text-white/50 tracking-widest tabular-nums">
              {String(activeImage + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => setActiveImage(prev => Math.min(project.images.length - 1, prev + 1))}
              disabled={activeImage === project.images.length - 1}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ===== FULL-WIDTH CONTENT SECTION ===== */}
      <div className="w-full px-8 md:px-12 lg:px-16 py-16 md:py-24">
        
        {/* Two Column Layout - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          
          {/* Left: Description - Takes 8 columns */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-6">About This Project</h2>
              <div className="w-12 h-[2px] bg-orange-500 mb-8"></div>
              <div className="space-y-4">
                {project.description.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  
                  // Detect bullet points: lines starting with -, •, or *
                  const bulletMatch = trimmed.match(/^[-•*]\s*(.*)/);
                  if (bulletMatch) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 flex-shrink-0"></span>
                        <p className="text-base md:text-lg text-gray-300 leading-relaxed">{bulletMatch[1]}</p>
                      </div>
                    );
                  }
                  
                  // Regular paragraph
                  return (
                    <p key={i} className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Image Gallery - Full Width Grid */}
            {project.images && project.images.length > 1 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-6">Gallery</h2>
                <div className="w-12 h-[2px] bg-orange-500 mb-8"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                        activeImage === i 
                          ? 'border-orange-500 ring-2 ring-orange-500/30' 
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${project.name} screenshot ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white/50 tracking-widest">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Sticky Sidebar */}
            <div className="lg:sticky lg:top-32 space-y-10">

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-5">Tech Stack</h3>
                  <div className="flex gap-2 flex-wrap">
                    {project.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-5">Project Links</h3>
                {project.liveLink && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Live Site
                  </a>
                )}
                {project.githubLink && (
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Source Code
                  </a>
                )}
                {!project.liveLink && !project.githubLink && (
                  <p className="text-gray-500 text-sm text-center py-4">No links available for this project.</p>
                )}
              </div>

              {/* Date */}
              {project.createdAt && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500 mb-3">Published</h3>
                  <p className="text-gray-300 text-base font-medium">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
