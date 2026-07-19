import React, { useState, useEffect } from 'react';

export const About = () => {
  const [profileImg, setProfileImg] = useState('');
  const [imgError, setImgError] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://port-folio-website-backend-ta3p.vercel.app";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/public/profile`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        let imageUrl = typeof data === 'string' ? data : (data.image || data.profileImage || data.url);
        if (imageUrl) {
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${BACKEND_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
          setProfileImg(imageUrl);
        } else {
          setImgError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile image:", err);
        setImgError(true);
      });
  }, []);

  return (
    <div className="bg-black text-zinc-100 md:pt-[12rem] min-h-screen py-20 px-6 sm:px-12 lg:px-24 font-mono selection:bg-white selection:text-black">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Fixed Profile Block */}
        <div className="md:col-span-4  flex flex-col items-center md:items-start space-y-6">
          <div className="w-full max-w-[240px] aspect-square border border-zinc-900 bg-zinc-950 flex items-center justify-center overflow-hidden">
            {!imgError && profileImg ? (
              <img 
                src={profileImg} 
                alt="Profile" 
                onError={() => setImgError(true)}
                className="w-full h-full object-cover filter grayscale contrast-150 transition duration-300"
              />
            ) : (
              <span className="text-xs text-zinc-600 uppercase tracking-widest">[img_null]</span>
            )}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">ABOUT ME</h1>
            <p className="text-zinc-500 text-xs tracking-wider uppercase">// MERN STACK DEVELOPER</p>
          </div>
        </div>

        {/* Right Column: Content Blocks */}
        <div className="md:col-span-8 space-y-16">
          
          {/* Section: Education */}
          <div className="space-y-6">
            <div className="text-zinc-500 text-xs tracking-widest uppercase font-bold">
              // 01 . EDUCATION
            </div>
            <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">BS Computer Science (BSCS)</h3>
                <p className="text-zinc-400 text-sm mt-1">National Textile University, Faisalabad</p>
              </div>
              <div className="text-zinc-500 text-xs tabular-nums">
                2024 — 2028
              </div>
            </div>
          </div>

          {/* Section: Characteristics */}
          <div className="space-y-8">
            <div className="text-zinc-500 text-xs tracking-widest uppercase font-bold">
              // 02 . CHARACTERISTICS
            </div>
            
            <div className="pt-4 border-t border-zinc-900 space-y-10 font-sans">
              
              {/* Point 1 */}
              <div className="flex gap-6 items-start">
                <span className="font-mono text-xs text-zinc-600 pt-0.5">[01]</span>
                <div className="space-y-1">
                  <h4 className="text-white font-bold tracking-tight uppercase text-sm">Problem Solver</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Thrive on building robust backend logic and managing efficient dataset interactions. Breaking down complex edge-cases into clean, structural algorithms is my core workflow.
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-6 items-start">
                <span className="font-mono text-xs text-zinc-600 pt-0.5">[02]</span>
                <div className="space-y-1">
                  <h4 className="text-white font-bold tracking-tight uppercase text-sm">Detail Oriented</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Dedicated to structured React architectures and pixel-perfect high-contrast UI components. I value minimal code structures and optimized client-side response states.
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-6 items-start">
                <span className="font-mono text-xs text-zinc-600 pt-0.5">[03]</span>
                <div className="space-y-1">
                  <h4 className="text-white font-bold tracking-tight uppercase text-sm">Continuous Learner</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Seamlessly bridging formal computer science paradigms at university with modern application development tools. Keeping production patterns aligned with modern systems.
                  </p>
                </div>
              </div>

              {/* Point 4 */}
              <div className="flex gap-6 items-start">
                <span className="font-mono text-xs text-zinc-600 pt-0.5">[04]</span>
                <div className="space-y-1">
                  <h4 className="text-white font-bold tracking-tight uppercase text-sm">Adaptive Collaborator</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Capable of independent end-to-end management, covering schema configuration in MongoDB, routing in Express, and lifecycle management on frontend states.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
