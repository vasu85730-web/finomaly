"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelemetryCollector, RawTelemetry } from '@/lib/telemetry';
import { VectorFingerprintingEngine, NormalizedVector } from '@/lib/fingerprint';
import { X, ShieldCheck, ShieldAlert, Shield, Loader2, Fingerprint } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PresetScenarios = {
  baseline: [0.35, 0.45, 0.1, 0.6, 0.55], // Baseline Owner Vector
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [collector] = useState(() => new TelemetryCollector());
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ status: string; percentage: number } | null>(null);
  const [phase, setPhase] = useState(0); // 0: input, 1: scanning, 2: result
  
  useEffect(() => {
    if (isOpen) {
      collector.start();
      setResult(null);
      setIsVerifying(false);
      setPhase(0);
    } else {
      collector.stop();
    }
  }, [isOpen, collector]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase(1);
    
    const raw = collector.stop();
    const liveVector = VectorFingerprintingEngine.extractVector(raw);
    const baselineVector = VectorFingerprintingEngine.normalize(PresetScenarios.baseline);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baselineVector, liveVector }),
      });
      const data = await res.json();
      
      // Artificial delay for cinematic effect
      setTimeout(() => {
        setResult({ status: data.status, percentage: data.percentage });
        setPhase(2);
      }, 2500);
    } catch (error) {
      console.error(error);
      setPhase(0);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'MATCH CONFIRMED') return 'text-neon-green border-neon-green shadow-neon-green/50';
    if (status === 'RUSHED STATE (SAFE)') return 'text-yellow-400 border-yellow-400 shadow-yellow-400/50';
    return 'text-red-500 border-red-500 shadow-red-500/50';
  };
  
  const getGlowColor = (status: string) => {
    if (status === 'MATCH CONFIRMED') return 'rgba(57, 255, 20, 0.5)';
    if (status === 'RUSHED STATE (SAFE)') return 'rgba(250, 204, 21, 0.5)';
    return 'rgba(239, 68, 68, 0.5)';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl p-4 font-mono"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-lg rounded-2xl p-8 relative border border-white/10 bg-charcoal shadow-2xl overflow-hidden"
          >
            {/* Background scanner fx in modal */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,69,0,0.05)_0%,transparent_70%)] pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {phase === 0 && (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6 mt-4 relative z-10"
              >
                <div className="text-center mb-8">
                  <Shield className="w-12 h-12 text-neon-orange mx-auto mb-4" />
                  <h2 className="text-2xl font-black tracking-widest text-white uppercase">SECURE PORTAL</h2>
                  <p className="text-xs text-gray-400 mt-2 tracking-widest">CONTINUOUS BEHAVIORAL TELEMETRY ACTIVE</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] mb-2 text-gray-500 tracking-[0.2em]">IDENTIFIER</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-black/50 border border-white/10 rounded p-4 text-white font-sans focus:outline-none focus:border-neon-orange transition-colors"
                      placeholder="user@system.core" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] mb-2 text-gray-500 tracking-[0.2em]">PASSPHRASE</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-black/50 border border-white/10 rounded p-4 text-white font-sans focus:outline-none focus:border-neon-orange transition-colors"
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-neon-orange text-black font-bold tracking-[0.2em] py-4 rounded hover:bg-orange-500 transition-colors mt-8 shadow-[0_0_20px_rgba(255,69,0,0.3)] hover:shadow-[0_0_30px_rgba(255,69,0,0.5)]"
                >
                  AUTHENTICATE
                </button>
              </motion.form>
            )}

            {phase === 1 && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-16 flex flex-col items-center justify-center space-y-8 relative z-10"
              >
                <div className="relative">
                   <Fingerprint className="w-24 h-24 text-cyan-500" strokeWidth={1} />
                   <motion.div 
                     className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#00ffff]"
                     animate={{ y: [0, 96, 0] }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   />
                </div>
                <div className="text-center">
                  <p className="tracking-[0.3em] text-sm text-cyan-400 animate-pulse uppercase mb-2">Analyzing Vector</p>
                  <p className="text-[10px] text-gray-500 tracking-widest">CROSS-REFERENCING DATABASE...</p>
                </div>
              </motion.div>
            )}

            {phase === 2 && result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-6 relative z-10"
              >
                <motion.div 
                  className={`p-6 rounded-full border border-current shadow-[0_0_50px_${getGlowColor(result.status)}] ${getStatusColor(result.status).split(' ')[0]}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {result.status === 'MATCH CONFIRMED' && <ShieldCheck className="w-20 h-20" />}
                  {result.status === 'RUSHED STATE (SAFE)' && <Shield className="w-20 h-20" />}
                  {result.status === 'MULE DETECTED' && <ShieldAlert className="w-20 h-20" />}
                </motion.div>
                
                <div>
                  <h3 className={`text-3xl font-black tracking-widest uppercase ${getStatusColor(result.status).split(' ')[0]}`}>
                    {result.status}
                  </h3>
                  <p className="text-gray-400 text-xs tracking-[0.2em] mt-3">
                    SIMILARITY SCORE: <span className="text-white font-bold">{result.percentage}%</span>
                  </p>
                  
                  {result.status === 'RUSHED STATE (SAFE)' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-yellow-400/80 text-[10px] mt-4 max-w-[80%] mx-auto font-mono"
                    >
                      * Variance detected (e.g., Bad Day / Distracted). Dynamic tolerance applied to prevent false positive lockout.
                    </motion.p>
                  )}
                </div>

                <button 
                  onClick={onClose}
                  className="mt-8 px-8 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors text-xs tracking-widest font-bold"
                >
                  CLOSE
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
