import React from 'react'

export const Quote = () => {
  return (
    <section className="relative w-full bg-[#0a0a0c] py-24 sm:py-32 px-6 sm:px-12 overflow-hidden border-b border-white/5">
      
      {/* 1. Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Top Subtle Border Highlight Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />

      {/* 2. Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Quote Card Box */}
        <div className="clickable relative w-full bg-[#141418]/80 border border-white/10 hover:border-amber-500/40 backdrop-blur-xl rounded-3xl p-8 sm:p-14 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-500 group">
          
          {/* Glowing Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-500/20 to-transparent rounded-tl-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-br-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Decorative Quote Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>

          {/* Quote Text Statement */}
          <blockquote className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-100 leading-snug sm:leading-relaxed tracking-tight mb-8 sm:mb-10">
            "Code is not just syntax, it is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">digital craftsmanship</span>. Great software is built at the intersection of performance, precision, and purpose."
          </blockquote>

        

        </div>

      </div>

    </section>
  )
}