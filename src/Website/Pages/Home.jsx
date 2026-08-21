import React, { useState, useEffect, useRef } from 'react'
import { TopProjects } from '../Components/TopProjects'
import { SkillsSection } from '../Components/SkillsSection'
import { TestimonialsSection } from '../Components/TestimonialsSection'
import { Contact } from './Contact'
import { Quote } from '../Components/Quote'

export const Home = () => {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)
  
  // Profile image & Dual Loading States
  const [profileImage, setProfileImage] = useState('https://avatars.githubusercontent.com/u/189430986?v=4')
  const [loadingApi, setLoadingApi] = useState(true)
  const [isImgLoaded, setIsImgLoaded] = useState(false)

  // Backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 1. Database se Profile Image Fetch karne ka Effect
  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/public/profile`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data && data.profileImage) {
            setProfileImage(data.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        if (isMounted) setLoadingApi(false);
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [BACKEND_URL]);

  // Image Source Resolution
  const finalImageSrc = profileImage 
    ? (profileImage.startsWith('http') || profileImage.startsWith('data:')
        ? profileImage 
        : `${BACKEND_URL}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`)
    : "https://avatars.githubusercontent.com/u/189430986?v=4";

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

  // Complete Loading condition: jab tak API + Actual Image rendering finish nahi hoti
  const isLoading = loadingApi || !isImgLoaded;

  return (
    <>
  {/* HERO SECTION */}
<div 
  ref={vantaRef} 
  className="homepage relative overflow-hidden min-h-screen w-full text-white flex items-center justify-center bg-[#121212] pt-28 pb-16 lg:py-0"
  style={{ fontFamily: "'Clarity City', sans-serif" }}
>
  {/* Advanced Ambient Glow Effect */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-amber-300/5 rounded-full blur-[130px] pointer-events-none z-0" />

  {/* 3-Column Layout Container with 10rem Gap on Desktop */}
  <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-[10rem] items-center justify-items-center w-full max-w-[1800px]">
    
    {/* LEFT SIDE: Heading */}
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1 w-full max-w-lg lg:max-w-none mx-auto lg:mx-0">
     

      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12] text-white">
        BUILDING DIGITAL WEB<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
          EXPERIENCES
        </span>
      </h1>
    </div>

    {/* MIDDLE: Hero Image */}
    <div className="flex justify-center items-center order-2 w-full">
      <div className="relative group w-[230px] h-[230px] sm:w-[300px] sm:h-[300px] lg:w-[320px] lg:h-[320px] xl:w-[350px] xl:h-[350px]">
        
        {/* Outer Glowing Effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl transition-opacity duration-1000 ${
            isLoading ? 'opacity-20 animate-pulse' : 'opacity-35 group-hover:opacity-50'
          }`}
        />

        {/* Skeleton Loader */}
        {isLoading && (
          <div className="absolute inset-0 z-20 rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-3 animate-pulse shadow-2xl">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
              Loading Hero...
            </span>
          </div>
        )}

        {/* Profile Image */}
        <img 
          src={finalImageSrc} 
          alt="MERN Stack Developer" 
          onLoad={() => setIsImgLoaded && setIsImgLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null; 
            e.currentTarget.src = "https://avatars.githubusercontent.com/u/189430986?v=4"; 
            if (setIsImgLoaded) setIsImgLoaded(true);
          }}
          className={`relative z-10 w-full h-full object-cover rounded-full border-2 border-white/10 shadow-2xl transition-all duration-700 ease-out ${
            isLoading 
              ? 'opacity-0 scale-95 blur-sm' 
              : 'opacity-100 scale-100 blur-0 group-hover:scale-[1.02]'
          }`}
        />

        {/* Electric Yellow Verified Badge */}
        <div 
          className={`absolute bottom-[5%] right-[5%] z-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] border-2 border-[#121212] transition-all duration-500 ease-out p-2 sm:p-2.5 ${
            isLoading 
              ? 'opacity-0 scale-50 translate-y-2' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          title="Verified MERN Stack Developer"
        >
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5 text-black font-black" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

      </div>
    </div>

    {/* RIGHT SIDE: Bio Callout */}
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-3 w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
      <div className="relative group w-full">
        
        {/* Ambient glow behind tooltip */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent rounded-3xl blur-xl opacity-60 pointer-events-none"></div>

        {/* Tooltip Card Body */}
        <div className="relative bg-[#141418]/95 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-300">
          
          {/* Desktop Pointer */}
          <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-r-[12px] border-r-[#141418]/95 z-20"></div>
          <div className="hidden lg:block absolute -left-[14px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[11px] border-y-transparent border-r-[14px] border-r-white/10 z-10"></div>

          {/* Mobile Pointer */}
          <div className="block lg:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[12px] border-b-[#141418]/95 z-20"></div>
          <div className="block lg:hidden absolute -top-[14px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[11px] border-x-transparent border-b-[14px] border-b-white/10 z-10"></div>

          {/* Header Tag */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
              BIO // QUICK INTRO
            </span>
          </div>

          {/* Text */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed tracking-wide">
            I'm a <span className="text-amber-400 font-semibold">MERN Stack Developer</span> focused on building fast, scalable, and secure web applications with modern technologies, clean architecture, and seamless user experiences.
          </p>
        </div>

      </div>
    </div>
    
  </div>
</div>

      <TopProjects />
      <SkillsSection />
      <Quote/>
      <TestimonialsSection />
      <Contact />
    </>
  );
} 