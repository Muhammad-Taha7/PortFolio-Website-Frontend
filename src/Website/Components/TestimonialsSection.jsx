import React, { useState, useEffect } from 'react';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Dummy backup data agar backend data khali ho ya fetch na ho paaye
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

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.length > 0 ? data : backupTestimonials);
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
  }, []);

  const getImageUrl = (img) => {
    if (!img) return '';
    return img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const makeActive = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
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

  if (loading || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[activeIndex];
  const imgUrl = getImageUrl(currentTestimonial.clientImage);
  const initials = currentTestimonial.clientName 
    ? currentTestimonial.clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) 
    : '?';

  return (
    <div 
      className="w-full bg-[#070707] py-28 md:py-40 overflow-hidden relative" 
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background Subtle Ambient Light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Heading Block */}
        <div className="text-center mb-20 md:mb-28">
          <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm block mb-4">
            Endorsements
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
            What Clients Say
          </h2>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 mb-8 rounded-full"></div>
        </div>

        {/* Big Premium Testimonial Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[500px]">
          
          {/* Left Side: Massive/Stylized Image Display */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group">
              
              {/* Outer Decorative Glow borders */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-3xl blur-2xl opacity-70"></div>
              
              {/* Main Image Holder */}
              <div className="w-full h-full bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                {imgUrl ? (
                  <img 
                    src={imgUrl} 
                    alt={currentTestimonial.clientName} 
                    className={`w-full h-full object-cover transition-all duration-500 ${isAnimating ? 'scale-105 opacity-40 blur-sm' : 'scale-100 opacity-100 blur-0'}`}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br from-orange-600 via-rose-600 to-purple-700 flex items-center justify-center text-white font-black text-7xl md:text-8xl transition-all duration-500 ${isAnimating ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
                    {initials}
                  </div>
                )}
                
                {/* Floating Modern Index Badge inside image */}
                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white/70 font-mono text-sm tracking-widest z-20">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Showcase Content & Giant Quotes */}
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            
            {/* Massive Background Quote Icon */}
            <span className="absolute -top-16 -left-8 text-[12rem] md:text-[16rem] font-serif text-white/[0.03] select-none pointer-events-none leading-none">
              “
            </span>

            {/* Testimonial Core Content */}
            <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-6 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
              
              {/* Star Ratings */}
              <div className="flex gap-1.5 mb-6">
                {Array.from({ length: 5 }, (_, s) => (
                  <svg 
                    key={s} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${s < currentTestimonial.rating ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'text-white/10'}`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Dynamic Bada Statement */}
              <p className="text-xl md:text-3xl text-gray-200 font-medium leading-relaxed italic mb-8 tracking-wide">
                "{currentTestimonial.testimonialText}"
              </p>

              {/* Author Details */}
              <div className="border-l-4 border-orange-500 pl-6 py-1">
                <h3 className="text-white font-extrabold text-2xl tracking-wide">
                  {currentTestimonial.clientName}
                </h3>
                <span className="text-orange-500 text-sm font-bold tracking-widest uppercase block mt-1">
                  {currentTestimonial.clientRole || 'Client'}
                </span>
              </div>
            </div>

            {/* Navigation Block */}
            <div className="flex items-center gap-4 mt-12 md:mt-16 z-20">
              <button 
                onClick={movePrevious}
                disabled={isAnimating}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-40 disabled:pointer-events-none group active:scale-95"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <button 
                onClick={moveNext}
                disabled={isAnimating}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white disabled:opacity-40 disabled:pointer-events-none group active:scale-95"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6 6-6"/></svg>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
