import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { FaWhatsapp, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-4">
      {/* Options Menu */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 ease-out origin-bottom ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Email */}
        <a 
          href="mailto:meet.tahadev@gmail.com" 
          title="Email Me"
          className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <FaEnvelope size={20} />
        </a>

        {/* LinkedIn */}
        <a 
          href="https://www.linkedin.com/in/mr-taha-b05849423/" 
          target="_blank" 
          rel="noopener noreferrer"
          title="LinkedIn"
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <FaLinkedin size={22} />
        </a>

        {/* WhatsApp */}
        <a 
          href="https://wa.me/923150792645?text=Hello%20Taha!" 
          target="_blank" 
          rel="noopener noreferrer"
          title="WhatsApp"
          className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <FaWhatsapp size={24} />
        </a>
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-orange-700 transition-all duration-300"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};
