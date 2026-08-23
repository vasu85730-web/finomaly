"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Scan, Cpu } from 'lucide-react';

export default function LoadingSequence() {
  const [phase, setPhase] = useState(0); 
  // 0: Initializing, 1: Scanning Hand, 2: Access Granted, 3: Complete

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 4500);
    const t3 = setTimeout(() => setPhase(3), 6000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 3) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="loading-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[999] bg-[#020202] flex flex-col items-center justify-center font-mono overflow-hidden"
      >
        {/* Background Grid & Cyber Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative w-96 h-96 flex items-center justify-center">
          
          {/* Static Circuit Rings */}
          <div className="absolute inset-0 border border-cyan-500/20 rounded-full scale-75" />
          <div className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full scale-90 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-105" />

          {/* Central Hand Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative z-10 transition-colors duration-700 ${phase === 2 ? 'text-neon-green drop-shadow-[0_0_20px_#39ff14]' : 'text-cyan-500/50 drop-shadow-[0_0_15px_#00ffff]'}`}
          >
            <Hand className="w-32 h-32" strokeWidth={1} />
          </motion.div>

          {/* Scanning Beam (Phase 1) */}
          {phase === 1 && (
            <>
              <motion.div 
                className="absolute inset-0 z-20"
                animate={{ y: ["-50%", "50%", "-50%"] }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              >
                <div className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#00ffff]" />
                <div className="w-full h-24 bg-gradient-to-b from-cyan-400/20 to-transparent" />
              </motion.div>
              
              <motion.div 
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              >
                <Scan className="w-64 h-64 text-cyan-500/40" strokeWidth={0.5} />
              </motion.div>
            </>
          )}

          {/* Access Granted Glow (Phase 2) */}
          {phase === 2 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 2], opacity: [1, 0] }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 bg-neon-green rounded-full mix-blend-screen"
            />
          )}
        </div>

        {/* Status Text Area */}
        <div className="mt-12 text-center h-24">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div key="phase0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Cpu className="w-6 h-6 text-gray-500 mx-auto mb-2 animate-pulse" />
                <p className="text-gray-500 tracking-[0.3em] text-sm">INITIALIZING SYSTEM</p>
              </motion.div>
            )}
            {phase === 1 && (
              <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-cyan-400 tracking-[0.4em] text-xl font-bold animate-pulse drop-shadow-[0_0_8px_#00ffff]">SCANNING BIOMETRICS</p>
                <div className="flex gap-2 justify-center mt-4">
                  {[0,1,2,3,4].map(i => (
                    <motion.div key={i} className="w-2 h-2 bg-cyan-500" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }} />
                  ))}
                </div>
              </motion.div>
            )}
            {phase === 2 && (
              <motion.div key="phase2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <p className="text-neon-green tracking-[0.4em] text-2xl font-black drop-shadow-[0_0_15px_#39ff14]">ACCESS GRANTED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
