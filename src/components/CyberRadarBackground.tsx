"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function CyberRadarBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center -z-10 [perspective:1000px]">
      <motion.div 
        initial={{ rotateX: 60, scale: 0.8 }}
        animate={{ rotateX: 60, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] flex items-center justify-center opacity-40"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_50%)]" />

        {/* Concentric circles */}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full border ${i % 2 === 0 ? 'border-cyan-500/20' : 'border-white/5'} shadow-[0_0_15px_rgba(0,255,255,0.05)]`}
            style={{
              width: `${i * 14}%`,
              height: `${i * 14}%`,
              borderStyle: i === 7 ? 'dashed' : 'solid',
            }}
            animate={i % 2 !== 0 ? { rotate: 360 } : {}}
            transition={{ duration: 40 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
        
        {/* Radar sweep */}
        <motion.div
          className="absolute w-1/2 h-1/2 origin-bottom-right right-1/2 bottom-1/2 border-r border-cyan-400/50 bg-gradient-to-tr from-transparent to-cyan-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid lines */}
        <div className="absolute w-full h-[1px] bg-cyan-900/30" />
        <div className="absolute h-full w-[1px] bg-cyan-900/30" />
      </motion.div>
    </div>
  );
}
