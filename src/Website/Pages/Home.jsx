import React, { useState, useEffect, useRef } from 'react'
import { TopProjects } from '../Components/TopProjects'
import { SkillsSection } from '../Components/SkillsSection'
import { TestimonialsSection } from '../Components/TestimonialsSection'
import { Contact } from './Contact'

export const Home = () => {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)
  
  // Profile image aur loading state ke liye hooks
  const [profileImage, setProfileImage] = useState('')
  const [loadingImage, setLoadingImage] = useState(true)

  // Apna Backend URL yahan set karein
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-1jtz.vercel.app";

  // 1. Database se Profile Image Fetch karne ka Effect
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/profile`);
        if (response.ok) {
          const data = await response.json();
          // Backend data check: user schema ke mutabiq profileImage nikalna
          if (data && data.profileImage) {
            setProfileImage(data.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchProfileData();
  }, []);

  // 2. Vanta Background Effect Setup
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.head.appendChild(script)
      })
    }

    const initVanta = async () => {
      if (!window.THREE) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      }
      if (!window.VANTA || !window.VANTA.DOTS) {
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js')
      }

      if (!vantaEffect && window.VANTA && window.VANTA.DOTS && vantaRef.current) {
        setVantaEffect(
          window.VANTA.DOTS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xde6e12,
            color2: 0xd77f6c,
            backgroundColor: 0x0,
            showLines: true 
          })
        )
      }
    }

    initVanta()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      {/* HERO SECTION */}
      <div 
        ref={vantaRef} 
        className="homepage relative overflow-hidden min-h-[100vh] lg:h-[100vh] w-full text-white flex items-center bg-[#121212] py-20 lg:py-0"
        style={{ fontFamily: "'Clarity City', sans-serif" }}
      >
        {/* Advanced Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-orange-500/10 via-rose-500/10 to-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* 3-Column Layout Container */}
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center w-full ">
          
          {/* LEFT SIDE: Heading & Badges */}
          <div className="flex flex-col  items-center lg:items-start text-center lg:text-left order-1">
            {/* MERN Stack Badge */}
          
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
  BUILDING DIGITAL  WEB<br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-amber-300">
    EXPERIENCES
  </span>
</h1>
          </div>

          {/* MIDDLE: Hero Image (Dynamically Fetched with Slash & Error Handlers) */}
          <div className="flex justify-center items-center order-2 lg:order-2">
            <div className="relative group max-w-[280px] sm:max-w-[350px] lg:max-w-full">
              {/* Image Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500  blur-xl opacity-35 group-hover:opacity-50 transition-opacity duration-500"></div>
              
              {/* Actual Image Render logic */}
              {loadingImage ? (
                <div className="relative z-10 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] border border-white/10 bg-white/5 flex items-center justify-center text-sm text-neutral-400">
                  <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                  Loading Profile...
                </div>
              ) : (
                <img 
                  // URL construct karte waqt external links (e.g. github) aur local uploads ko handle kiya gaya hai
                  src={
                    profileImage 
                      ? (profileImage.startsWith('http') 
                          ? profileImage 
                          : `${BACKEND_URL}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`)
                      : "/hero-img.png"
                  } 
                  alt="MERN Stack Developer" 
                  className="relative z-10 w-full  object-cover rounded-full  border-white/10 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={(e) => {
                    // Agar API sahi link de par image uploads folder se delete ho chuki ho, toh component crash nahi hoga
                    e.target.onerror = null; 
                    e.target.src = "/hero-img.png"; 
                  }}
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Subtext & Action Buttons */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right order-3">
            {/* Right Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm font-medium tracking-wider text-rose-400 mb-6 uppercase">
             MERN 
            </div>
<p className="text-sm sm:text-base lg:text-lg text-neutral-400 mb-8 max-w-lg font-medium leading-relaxed text-left">
  I'm a <span className="text-white font-semibold">MERN Stack Developer</span> focused on building fast, scalable, and secure web applications with modern technologies, clean architecture, and seamless user experiences.
</p>
           
          </div>
          
        </div>
      </div>

          <TopProjects />
          <SkillsSection />
          <TestimonialsSection />
          <Contact />
    </>
  );
}
