import React, { useState, useEffect } from 'react';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-nine.vercel.app";

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return '';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  return (
    <div className="w-full min-h-screen bg-[#070707] pt-32 pb-24 overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm block mb-4">
            Endorsements
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Client Feedback
          </h1>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Read what previous clients and colleagues have to say about my work, dedication, and technical expertise.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No testimonials available yet.
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {testimonials.map((t) => {
              const imgUrl = getImageUrl(t.clientImage);
              const initials = t.clientName ? t.clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
              
              return (
                <div 
                  key={t._id} 
                  className="break-inside-avoid bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 relative group"
                >
                  {/* Quote Icon Background */}
                  <span className="absolute top-6 right-6 text-6xl font-serif text-white/[0.03] select-none group-hover:text-orange-500/10 transition-colors">
                    "
                  </span>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }, (_, s) => (
                      <svg 
                        key={s} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${s < t.rating ? 'text-orange-500' : 'text-white/10'}`} 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-300 text-base md:text-lg italic leading-relaxed mb-8 relative z-10">
                    "{t.testimonialText}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                    {imgUrl ? (
                      <img src={imgUrl} alt={t.clientName} className="w-14 h-14 rounded-full object-cover border-2 border-orange-500/30" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-rose-600 flex items-center justify-center text-white font-bold text-xl border-2 border-orange-500/30">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-bold tracking-wide">{t.clientName}</h4>
                      <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider block mt-1">
                        {t.clientRole || 'Client'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
