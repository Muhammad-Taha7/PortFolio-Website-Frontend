import React, { useState, useEffect, useRef } from 'react';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const autoPlayRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  // Backup testimonials data
  const backupTestimonials = [
    {
      _id: "1",
      clientName: "Sarah Jenkins",
      clientRole: "CEO, TechVibe",
      rating: 5,
      testimonialText: "Working with this developer was an absolute game-changer. The attention to detail and performance optimization they brought to our MERN application was top-tier."
    },
    {
      _id: "2",
      clientName: "David Miller",
      clientRole: "Product Manager",
      rating: 5,
      testimonialText: "Exceptional clean code and pixel-perfect UI. The animations are buttery smooth, and the backend scalability is solid. Highly recommended for full-stack projects."
    }
  ];

  // Fetch Testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data && data.length > 0 ? data : backupTestimonials);
        } else {
          setTestimonials(backupTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(backupTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [BACKEND_URL]);

  // Handle slide transitions
  const makeActive = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const movePrevious = () => {
    if (isAnimating) return;
    const newIndex = activeIndex - 1 < 0 ? testimonials.length - 1 : activeIndex - 1;
    makeActive(newIndex);
  };

  const moveNext = () => {
    if (isAnimating) return;
    const newIndex = activeIndex + 1 >= testimonials.length ? 0 : activeIndex + 1;
    makeActive(newIndex);
  };

  // Auto-play interval
  useEffect(() => {
    if (loading || testimonials.length <= 1 || isHovered) return;

    autoPlayRef.current = setInterval(() => {
      moveNext();
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeIndex, loading, testimonials.length, isHovered, isAnimating]);

  const getImageUrl = (img) => {
    if (!img) return '';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  if (loading) {
    return (
      <div className="w-full bg-[#070707] py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[activeIndex];
  const imgUrl = getImageUrl(currentTestimonial?.clientImage);
  const initials = currentTestimonial?.clientName 
    ? currentTestimonial.clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) 
    : '?';

  return (
    <section 
      className="w-full bg-[#070707] py-14 md:py-20 overflow-hidden relative select-none" 
      style={{ fontFamily: "'Poppins', sans-serif" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs block mb-2">
            Endorsements
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            What Clients Say
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Testimonial Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[320px]">
          
          {/* Left Side: Avatar / Image */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-square">
              
              <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-2xl blur-xl opacity-70"></div>
              
              <div className="w-full h-full bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                {imgUrl ? (
                  <img 
                    src={imgUrl} 
                    alt={currentTestimonial.clientName || 'Client'} 
                    className={`w-full h-full object-cover transition-all duration-400 ease-out ${
                      isAnimating ? 'scale-105 opacity-30 blur-sm' : 'scale-100 opacity-100 blur-0'
                    }`}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br from-orange-600 via-rose-600 to-purple-700 flex items-center justify-center text-white font-black text-5xl transition-all duration-400 ${
                    isAnimating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                  }`}>
                    {initials}
                  </div>
                )}
                
                {/* Index Badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white/80 font-mono text-xs tracking-widest z-20">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Quote & Details */}
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            
            {/* Background Decorative Quote Mark */}
            <span className="absolute -top-12 -left-6 text-[8rem] md:text-[10rem] font-serif text-white/[0.03] select-none pointer-events-none leading-none">
              “
            </span>

            <div className={`transition-all duration-400 transform ${
              isAnimating ? 'opacity-0 translate-y-3 blur-sm' : 'opacity-100 translate-y-0 blur-0'
            }`}>
              
              {/* Star Ratings */}
              <div className="flex gap-1.5 mb-4">
                {Array.from({ length: 5 }, (_, s) => (
                  <svg 
                    key={s} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ${s < (currentTestimonial.rating || 5) ? 'text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]' : 'text-white/10'}`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Testimonial Statement */}
              <p className="text-lg md:text-2xl text-gray-200 font-medium leading-relaxed italic mb-6">
                "{currentTestimonial.testimonialText}"
              </p>

              {/* Author Info */}
              <div className="border-l-4 border-orange-500 pl-4 py-0.5">
                <h3 className="text-white font-extrabold text-xl tracking-wide">
                  {currentTestimonial.clientName}
                </h3>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase block mt-1">
                  {currentTestimonial.clientRole || 'Client'}
                </span>
              </div>
            </div>

            {/* Navigation Buttons & Pagination Dots */}
            <div className="flex items-center gap-6 mt-8 z-20">
              
              {/* Previous/Next Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={movePrevious}
                  disabled={isAnimating}
                  className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-40 disabled:pointer-events-none active:scale-95 group"
                  aria-label="Previous testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                
                <button 
                  onClick={moveNext}
                  disabled={isAnimating}
                  className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-40 disabled:pointer-events-none active:scale-95 group"
                  aria-label="Next testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>

          

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};