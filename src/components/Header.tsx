"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAimClick: () => void;
}

export default function Header({ onAimClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-neon-orange flex items-center justify-center">
          <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-[0.2em] text-white hidden sm:block">
          FINOM<span className="text-neon-orange">ALY</span>
        </span>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] text-gray-400">
        <a href="#" className="hover:text-white transition-colors">HOME</a>
        <a href="#about" className="hover:text-white transition-colors">ABOUT US</a>
        <a href="#tech" className="hover:text-white transition-colors">TECH</a>
        <a href="#architecture" className="hover:text-white transition-colors">ARCHITECTURE</a>
        <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
        <a href="#support" className="hover:text-white transition-colors">SUPPORT</a>
      </nav>

      <div>
        <button 
          onClick={onAimClick}
          className="bg-transparent border border-neon-orange text-neon-orange px-8 py-3 text-xs font-bold tracking-[0.2em] rounded hover:bg-neon-orange hover:text-black transition-colors duration-300 shadow-[0_0_15px_rgba(255,69,0,0.1)] hover:shadow-[0_0_20px_rgba(255,69,0,0.4)]"
        >
          OUR AIM
        </button>
      </div>
    </motion.header>
  );
}
