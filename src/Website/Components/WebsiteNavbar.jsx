import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const WebsiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/Projects' },
    { label: 'About', path: '/About' },
    { label: 'Contact', path: '/Contact' },
    { label: 'Blogs', path: '/Blogs' },
    { label: 'Testimonials', path: '/Testimonials' }
  ];

  return (
    <>
      {/* Top Main Navigation Bar */}
      <nav className={`fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 py-5 md:px-12 md:py-8 transition-colors duration-500 ${
        isOpen ? 'bg-transparent text-white' : 'bg-black/80 backdrop-blur-md text-white border-b border-white/5'
      }`}>
        {/* Logo Section */}
        <div className="logo relative z-50">
          <Link 
            to="/" 
            className="text-xl md:text-3xl font-black tracking-tighter uppercase hover:text-gray-300 transition-colors"
          >
            Mr.Taha
          </Link>
        </div>

        {/* Center Animated Text (MERN Stack Developer) */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-3 z-40 pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-xs text-bold lg:text-lg font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mt-0.5 pt-0.5 pb-0.5">
            MERN STACK DEVELOPER
          </div>
        </div>

        {/* Menu Trigger Button */}
        <div className="menu relative z-50">
          <button 
            onClick={toggleMenu}
            className={`relative bg-none border-none w-8 h-8 cursor-pointer p-0 z-50 focus:outline-none transition-colors duration-300 text-white
              before:content-[''] before:absolute before:block before:w-8 before:h-[2px] before:rounded-[1px] before:bg-current before:top-0 before:transition-all before:duration-1000 before:ease-[cubic-bezier(.17,.67,0,1)]
              after:content-[''] after:absolute after:block after:w-8 after:h-[2px] after:rounded-[1px] after:bg-current after:top-0 after:transition-all after:duration-1000 after:ease-[cubic-bezier(.17,.67,0,1)]
              ${isOpen 
                ? 'before:translate-y-[15px] before:rotate-45 before:scale-[0.85] after:translate-y-[15px] after:rotate-[-45deg] after:scale-[0.85]' 
                : 'before:translate-y-[10px] after:translate-y-[18px]'
              }`}
            aria-label="Toggle Navigation"
          />
        </div>
      </nav>

      {/* Fullscreen Overlay Menu Panels */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-orange-600 z-40 flex flex-col pt-32 md:pt-40 px-8 md:px-24 transition-all duration-700 ease-[cubic-bezier(.17,.67,0,1)] ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{
          clipPath: isOpen 
            ? 'polygon(0 0, 0 100%, 25% 100%, 25% 0, 25% 0, 25% 100%, 50% 100%, 50% 0, 50% 0, 50% 100%, 75% 100%, 75% 0, 75% 0, 75% 100%, 100% 100%, 100% 0)'
            : 'polygon(0 0, 0 0%, 25% 0%, 25% 0, 25% 0, 25% 0%, 50% 0%, 50% 0, 50% 0, 50% 0%, 75% 0%, 75% 0, 75% 0, 75% 0%, 100% 0%, 100% 0)'
        }}
      >
        <ul className="w-full max-w-4xl mx-auto space-y-2 md:space-y-4 list-none p-0 text-left overflow-y-auto max-h-[60vh] md:max-h-[70vh] pb-10">
          {navItems.map((item, index) => (
            <li 
              key={item.label} 
              className="overflow-hidden"
            >
              <div 
                className={`transform transition-transform duration-700 ease-out ${
                  isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ transitionDelay: `${isOpen ? 0.2 + (index * 0.1) : 0}s` }}
              >
                <Link 
                  to={item.path} 
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white hover:text-orange-950 transition-colors duration-300 no-underline inline-block uppercase tracking-tighter"
                >
                  {item.label}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer Info inside Menu */}
        <div 
          className={`absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white/80 font-medium transition-opacity duration-700 ${
            isOpen ? 'opacity-100 delay-700' : 'opacity-0 delay-0'
          }`}
        >
          <div>
            <p className="text-sm uppercase tracking-widest text-orange-950/60 font-bold mb-1">Get in touch</p>
            <a href="mailto:meet.tahadev@gmail.com" className="text-white hover:text-orange-950 transition-colors text-xl md:text-2xl font-bold inline-block">
             meet.tahadev@gmail.com
            </a>
          </div>
          <div className="flex gap-4 md:gap-8 text-sm md:text-base font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-orange-950 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-orange-950 transition-colors">GitHub</a>
            <a href="#" className="hover:text-orange-950 transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </>
  );
};
