import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { FaWhatsapp, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* CSS Animation for Infinite Circular Rotation */}
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
      `}</style>

      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-center gap-5">
        {/* Floating Contact Options */}
        <div
          className={`flex flex-col gap-4 transition-all duration-300 ease-out origin-bottom ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-50 translate-y-10 pointer-events-none'
          }`}
        >
          {/* Email Option */}
          <a
            href="mailto:meet.tahadev@gmail.com"
            title="Email Me"
            className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
          >
            <FaEnvelope size={24} />
            <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Email
            </span>
          </a>

          {/* LinkedIn Option */}
          <a
            href="https://www.linkedin.com/in/mr-taha-b05849423/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
          >
            <FaLinkedin size={26} />
            <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              LinkedIn
            </span>
          </a>

          {/* WhatsApp Option */}
          <a
            href="https://wa.me/923150792645?text=Hello%20Taha!"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
          >
            <FaWhatsapp size={28} />
            <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              WhatsApp
            </span>
          </a>
        </div>

        {/* Main Toggle Button Container */}
        <div className="relative flex items-center justify-center">
          {/* Circular Marquee Ring (Visible when menu is closed) */}
          <div
            className={`absolute w-32 h-32 pointer-events-none transition-opacity duration-300 ${
              isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
          >
            <svg
              className="w-full h-full animate-spin-slow"
              viewBox="0 0 120 120"
            >
              <defs>
                <path
                  id="textCircle"
                  d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                />
              </defs>
              <text fill="#f97316" className="text-[10px] font-bold tracking-[0.22em] uppercase">
                <textPath href="#textCircle" startOffset="0%">
                  • GET IN TOUCH • HIRE ME • CONTACT ME
                </textPath>
              </text>
            </svg>
          </div>

          {/* Main Action Button (Larger w-20 h-20) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Contact Menu"
            className="relative z-10 w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(249,115,22,0.4)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {isOpen ? (
              <X size={34} className="transition-transform duration-300 rotate-90" />
            ) : (
              <MessageCircle size={34} className="transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};