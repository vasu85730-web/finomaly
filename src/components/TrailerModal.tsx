"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  const [phase, setPhase] = useState(-1);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase(-1);
      setCounter(0);
      return;
    }

    let audioCtx: AudioContext | null = null;
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {}

    const playBeep = () => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    };

    const playCrash = () => {
      if (!audioCtx) return;
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    };

    // Phase -1: 1 second black screen
    const t0 = setTimeout(() => {
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      setPhase(0);
      
      let currentCount = 10;
      setCounter(currentCount);

      const countInterval = setInterval(() => {
        // Aiming for ~3.5 Lakh in 4500ms (90 ticks). roughly 3000-5000 per tick
        currentCount += Math.floor(Math.random() * 5000) + 1000;
        setCounter(currentCount);
        if (Math.random() > 0.5) playBeep();
      }, 50);

      const shatterTimer = setTimeout(() => {
        clearInterval(countInterval);
        setPhase(2);
        playCrash();
        
        setTimeout(() => setPhase(3), 2000); // Stats
      }, 4500);

      const timer4 = setTimeout(() => setPhase(4), 10500); // RBI
      const timer5 = setTimeout(() => setPhase(5), 18500); // Solution
      const timer6 = setTimeout(() => setPhase(6), 22500); // Logo
      const timer7 = setTimeout(() => setPhase(7), 27500); // Functions

      return () => {
        clearInterval(countInterval);
        clearTimeout(shatterTimer);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(timer7);
        if (audioCtx) audioCtx.close();
      };
    }, 1000); // 1 second black screen delay

    return () => clearTimeout(t0);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white z-50 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* 1 sec black screen is phase -1, renders nothing but background */}

          {/* Phase 0 & 1: Counter */}
          <AnimatePresence>
            {phase === 0 && (
              <motion.div 
                key="counter"
                exit={{ opacity: 0, scale: 1.5 }}
                className="text-center"
              >
                <p className="text-gray-400 tracking-[0.2em] mb-4">NUMBER OF CYBERCRIMES IN INDIA (2025) -</p>
                <motion.div 
                  className="text-6xl md:text-[10rem] font-black text-red-500 font-mono"
                  animate={counter > 100000 ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                >
                  {counter.toLocaleString()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Shatter */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div 
                key="shatter"
                initial={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                animate={{ 
                  scale: [1, 3], 
                  opacity: [1, 0], 
                  rotateZ: [0, -15], 
                  skewX: [0, 50],
                  filter: ["blur(0px)", "blur(20px)"]
                }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className="text-[10rem] font-black text-red-600 font-mono absolute"
              >
                {counter.toLocaleString()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3: Stats */}
          <AnimatePresence>
            {phase === 3 && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="text-center max-w-4xl px-6"
              >
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  MORE THAN <span className="text-red-500 text-7xl inline-block origin-bottom animate-[bounce_1s_ease-in-out_infinite]">28 LAKH</span><br/>CYBER CRIMES WERE RECORDED IN INDIA IN 2025.
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-2xl md:text-3xl text-gray-400 font-bold mt-8"
                >
                  OVER <span className="text-red-500 font-mono">₹22,000 CRORE</span> LOST.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: RBI Mule Accounts */}
          <AnimatePresence>
            {phase === 4 && (
              <motion.div 
                key="rbi"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="text-center max-w-3xl px-6"
              >
                <div className="w-20 h-20 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-red-500 font-bold text-2xl">RBI</div>
                <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-medium">
                  The Reserve Bank of India states that <span className="text-red-500 font-black font-mono bg-red-500/10 px-2 py-1">MULE ACCOUNTS</span> are the central artery of this epidemic.
                </p>
                <p className="text-lg text-gray-500 mt-6">
                  Synthetic identities and compromised accounts used to launder stolen funds, bypassing traditional security measures.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 5: Solution? */}
          <AnimatePresence>
            {phase === 5 && (
              <motion.div 
                key="solution"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="text-center"
              >
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  What's the solution?
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 6: Logo Reveal */}
          <AnimatePresence>
            {phase === 6 && (
              <motion.div 
                key="logo"
                initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-center relative"
              >
                <div className="absolute inset-0 bg-neon-orange/20 blur-[100px] rounded-full" />
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,69,0,0.8)] relative z-10">
                  FINOM<span className="text-neon-orange">ALY</span>
                </h1>
                <p className="text-2xl text-neon-orange tracking-[0.5em] mt-4 font-bold">IS HERE</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 7: Functions */}
          <AnimatePresence>
            {phase === 7 && (
              <motion.div 
                key="functions"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-5xl px-6 w-full"
              >
                <h2 className="text-3xl font-bold text-white mb-12 tracking-widest uppercase">Redefining Fintech Security</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 border border-neon-orange/30 bg-white/5 backdrop-blur-md rounded-xl"
                  >
                    <div className="text-neon-orange font-mono mb-4 text-sm">01 / TELEMETRY</div>
                    <h3 className="text-xl font-bold text-white mb-2">Continuous Profiling</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We map keystroke flight times, mouse jerkiness, and sensor vectors in real-time, completely invisible to the user.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="p-6 border border-neon-orange/30 bg-white/5 backdrop-blur-md rounded-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-neon-orange/10 animate-pulse" />
                    <div className="relative z-10">
                      <div className="text-neon-orange font-mono mb-4 text-sm">02 / DETECTION</div>
                      <h3 className="text-xl font-bold text-white mb-2">Mule Account Isolation</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Instantly flags operator mismatches when a mule attempts to use a compromised account, stopping fraud before the transaction.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.5 }}
                    className="p-6 border border-neon-orange/30 bg-white/5 backdrop-blur-md rounded-xl"
                  >
                    <div className="text-neon-orange font-mono mb-4 text-sm">03 / EXPERIENCE</div>
                    <h3 className="text-xl font-bold text-white mb-2">Zero-Friction</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      No OTPs. No captchas. Authentic users experience zero friction while fraudsters are locked out at the biometric layer.
                    </p>
                  </motion.div>
                </div>
                
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4 }}
                  onClick={onClose}
                  className="mt-16 px-8 py-3 bg-white text-black font-bold tracking-widest rounded hover:bg-neon-orange hover:text-white transition-colors"
                >
                  ENTER PLATFORM
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mock Subtitles */}
          <div className="absolute bottom-10 text-center w-full pointer-events-none opacity-30 text-xs font-mono">
            {phase === -1 && "[Silence...]"}
            {phase >= 0 && phase < 2 && "[Ominous, accelerating mechanical sound...]"}
            {phase === 2 && "[Loud shattering glass / digital glitch effect]"}
            {phase >= 3 && phase <= 4 && "[Heavy, somber orchestral music]"}
            {phase >= 5 && phase <= 6 && "[Music transitions... escalating tempo]"}
            {phase >= 6 && "[Uplifting, high-energy cyber-synth drop!]"}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
