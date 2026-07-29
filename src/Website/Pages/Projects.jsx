import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/projects`);
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
  }, [BACKEND_URL]);

  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  // Mouse move handler for 3D Tilt Effect
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt calculations (-10 deg to 10 deg)
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
      overwrite: 'auto'
    });
  };

  // Mouse leave handler to reset tilt
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

  return (
    <div className="w-full min-h-screen bg-[#070707] pt-32 pb-24 overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Decor */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm block mb-4">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            All Projects
          </h1>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-8 max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive list of my work, including web applications, backend systems, and full-stack solutions.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project._id}
                style={{ perspective: '1000px' }}
              >
                <div 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="group flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-orange-500/50 transition-colors duration-500 shadow-xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Image */}
                  <div className="w-full h-60 overflow-hidden relative">
                    <img 
                      src={getImageUrl(project.images?.[0])} 
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707] to-transparent opacity-80"></div>
                    {project.featured && (
                      <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-lg">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-grow bg-[#0c0c0c]">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-white/5 text-gray-300 rounded-md border border-white/10">
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 text-gray-400 rounded-md border border-white/10">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">
                      {project.description}
                    </p>

                    <Link 
                      to={`/project/${project._id}`}
                      className="inline-flex items-center justify-center w-full py-3 px-4 bg-white/5 hover:bg-orange-500 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 hover:border-orange-500 text-xs tracking-wider uppercase"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};