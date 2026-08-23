"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Globe, Shield, Wrench } from 'lucide-react';

interface AimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AimModal({ isOpen, onClose }: AimModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl p-4 font-sans"
        >
          <motion.div 
            initial={{ scale: 0.8, rotateX: 20, y: 50, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotateX: -20, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="w-full max-w-4xl rounded-2xl p-8 md:p-12 relative border border-white/10 bg-charcoal shadow-[0_0_50px_rgba(255,69,0,0.15)] overflow-hidden flex flex-col md:flex-row gap-8"
          >
            {/* Background scanner fx */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,69,0,0.1)_0%,transparent_60%)] pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex-1 relative z-10 space-y-6">
              <div className="flex items-center gap-3 text-neon-orange font-mono text-sm tracking-widest uppercase mb-2">
                <Target className="w-5 h-5" /> Post-Hackathon Vision
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                Scaling <span className="text-neon-orange">Finomaly</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Our journey doesn't end here. We built this proof-of-concept to demonstrate that zero-friction, continuous authentication is possible. Now, we are looking forward to the next steps.
              </p>

              <div className="space-y-6 mt-8">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex gap-4 items-start"
                >
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-cyan-400">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Expert Review & Iteration</h3>
                    <p className="text-sm text-gray-500 mt-1">Working closely with cybersecurity experts and financial regulators to identify loopholes and harden our vector fingerprinting algorithms.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex gap-4 items-start"
                >
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-neon-orange">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">National Level Deployment</h3>
                    <p className="text-sm text-gray-500 mt-1">Expanding Finomaly to integrate with national banking infrastructure, solving the multi-billion dollar mule account crisis at scale.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex gap-4 items-start"
                >
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-neon-green">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Cross-Platform Resilience</h3>
                    <p className="text-sm text-gray-500 mt-1">Extending telemetry beyond web to native mobile SDKs (iOS/Android) for unified behavioral profiling across all banking touchpoints.</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* 3D Visualizer Side */}
            <div className="hidden md:flex flex-1 items-center justify-center relative perspective-[1000px]">
               <motion.div 
                 animate={{ rotateY: [0, 360] }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 style={{ transformStyle: "preserve-3d" }}
                 className="w-64 h-64 relative"
               >
                 <div className="absolute inset-0 border-2 border-neon-orange/40 rounded-full" style={{ transform: 'rotateX(60deg)' }} />
                 <div className="absolute inset-0 border-2 border-cyan-500/40 rounded-full" style={{ transform: 'rotateX(60deg) rotateY(60deg)' }} />
                 <div className="absolute inset-0 border-2 border-white/20 rounded-full" style={{ transform: 'rotateX(60deg) rotateY(120deg)' }} />
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ transform: 'translateZ(50px) translateX(-50%) translateY(-50%)' }}>
                   <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">AIM</div>
                   <div className="text-[10px] text-neon-orange tracking-widest mt-2">2025 - 2026</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
