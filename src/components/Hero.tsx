"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  onWatchTrailer: () => void;
  onLoginClick: () => void;
}

export default function Hero({ onWatchTrailer, onLoginClick }: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
      
      <motion.div
        style={{ y: y1, opacity }}
        className="flex flex-col items-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth ease out
        >
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 leading-[0.9]">
            THE FUTURE<br/>IS <span className="text-neon-orange drop-shadow-[0_0_20px_rgba(255,69,0,0.6)]">NOW.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl text-gray-400 font-medium tracking-wide mb-10 leading-relaxed">
            Advanced behavioral biometrics. Unmatched purpose. Redefining fintech security today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <button onClick={onLoginClick} className="px-10 py-4 bg-neon-orange text-black font-bold tracking-widest text-sm rounded shadow-[0_0_15px_rgba(255,69,0,0.5)] hover:shadow-[0_0_30px_rgba(255,69,0,0.8)] hover:scale-105 transition-all duration-300">
            LOGIN
          </button>
          <button onClick={onWatchTrailer} className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold tracking-widest text-sm rounded hover:bg-white/5 hover:border-white/50 transition-all duration-300 backdrop-blur-sm group flex items-center justify-center gap-2">
            WATCH TRAILER
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono">Initiate Sequence</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </div>
  );
}
