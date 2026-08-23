"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, ShieldCheck, Shield, Target, Crosshair, Radar } from 'lucide-react';
import { TelemetryCollector, RawTelemetry } from '@/lib/telemetry';
import { VectorFingerprintingEngine, NormalizedVector } from '@/lib/fingerprint';

const PresetScenarios = {
  baseline: [0.35, 0.45, 0.1, 0.6, 0.55], // Baseline Owner Vector
  scenarioA: [0.34, 0.44, 0.11, 0.61, 0.53], // 90%+ match
  scenarioB: [0.75, 0.15, 0.6, 0.1, 0.1],   // <50% match (Impostor)
  scenarioC: [0.45, 0.55, 0.15, 0.7, 0.4],  // ~75% match (Rushed)
};

interface BiometricHUDProps {
  onClose?: () => void;
}

export default function BiometricHUD({ onClose }: BiometricHUDProps) {
  const [collector] = useState(() => new TelemetryCollector());
  const [isRecording, setIsRecording] = useState(false);
  const [baselineVector, setBaselineVector] = useState<NormalizedVector | null>(VectorFingerprintingEngine.normalize(PresetScenarios.baseline));
  const [liveVector, setLiveVector] = useState<NormalizedVector | null>(null);
  const [result, setResult] = useState<{ status: string; percentage: number } | null>(null);
  const [isBaselineConfigured, setIsBaselineConfigured] = useState(false);
  
  // Real-time visualizer state
  const [liveKeystrokes, setLiveKeystrokes] = useState<{key: string, duration: number}[]>([]);
  const lastKeyTime = useRef<number>(0);

  const handleStartRecording = () => {
    setIsRecording(true);
    setResult(null);
    setLiveVector(null);
    setLiveKeystrokes([]);
    collector.start();
  };

  const handleStopRecording = async () => {
    const raw = collector.stop();
    setIsRecording(false);
    
    const vector = VectorFingerprintingEngine.extractVector(raw);
    setLiveVector(vector);

    if (baselineVector) {
      await verifyAgainstBaseline(baselineVector, vector);
    }
  };

  const verifyAgainstBaseline = async (baseline: NormalizedVector, live: NormalizedVector) => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baselineVector: baseline, liveVector: live }),
      });
      const data = await res.json();
      setResult({ status: data.status, percentage: data.percentage });
    } catch (error) {
      console.error(error);
    }
  };

  const runScenario = (scenarioVectorRaw: number[]) => {
    const normalized = VectorFingerprintingEngine.normalize(scenarioVectorRaw);
    setLiveVector(normalized);
    if (baselineVector) {
      verifyAgainstBaseline(baselineVector, normalized);
    }
  };

  // Listen to keystrokes for the visualizer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isRecording) {
        lastKeyTime.current = Date.now();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (isRecording) {
        const duration = Date.now() - lastKeyTime.current;
        setLiveKeystrokes(prev => [...prev.slice(-19), { key: e.key, duration }]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isRecording]);

  const getStatusColor = (status: string) => {
    if (status === 'MATCH CONFIRMED') return 'text-neon-green border-neon-green shadow-neon-green/50';
    if (status === 'RUSHED STATE (SAFE)') return 'text-yellow-400 border-yellow-400 shadow-yellow-400/50';
    return 'text-red-500 border-red-500 shadow-red-500/50';
  };

  return (
    <div className={onClose ? "fixed inset-0 z-[300] bg-gray-950 text-cyan-400 font-mono p-6 selection:bg-cyan-500/30 overflow-y-auto" : "min-h-screen bg-gray-950 text-cyan-400 font-mono p-6 selection:bg-cyan-500/30 overflow-hidden relative"}>
      {onClose && (
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white z-50">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
      {/* High-tech Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#002233_1px,transparent_1px),linear-gradient(to_bottom,#002233_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <header className="mb-10 flex items-center justify-between border-b border-cyan-500/30 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-neon-green animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">FINOMALY SYSTEM</h1>
            <p className="text-xs text-cyan-600">v3.1.0 // CONTINUOUS AUTHENTICATION ENGINE</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => runScenario(PresetScenarios.scenarioA)} className="px-3 py-1 bg-gray-900 border border-cyan-500/50 hover:bg-cyan-900/40 text-xs transition-colors">TEST: A (OWNER)</button>
          <button onClick={() => runScenario(PresetScenarios.scenarioB)} className="px-3 py-1 bg-gray-900 border border-cyan-500/50 hover:bg-cyan-900/40 text-xs transition-colors">TEST: B (IMPOSTOR)</button>
          <button onClick={() => runScenario(PresetScenarios.scenarioC)} className="px-3 py-1 bg-gray-900 border border-cyan-500/50 hover:bg-cyan-900/40 text-xs transition-colors">TEST: C (RUSHED)</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gray-900/60 border border-cyan-500/30 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <h2 className="text-lg mb-4 flex items-center gap-2"><Target className="w-5 h-5" /> Target Session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1 text-cyan-600">EMAIL</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-cyan-900 rounded p-2 text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="user@corp.sys" 
                  onFocus={isRecording ? undefined : handleStartRecording}
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-cyan-600">PASSWORD</label>
                <input 
                  type="password" 
                  className="w-full bg-black/50 border border-cyan-900 rounded p-2 text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="••••••••" 
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-cyan-600">TRANSFER AMOUNT</label>
                <input 
                  type="number" 
                  className="w-full bg-black/50 border border-cyan-900 rounded p-2 text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="$ 0.00" 
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                {!isRecording ? (
                  <button onClick={handleStartRecording} className="flex-1 bg-cyan-950 border border-cyan-500 text-cyan-400 py-2 rounded hover:bg-cyan-900 transition-colors">Start Monitoring</button>
                ) : (
                  <button onClick={handleStopRecording} className="flex-1 bg-red-950 border border-red-500 text-red-400 py-2 rounded hover:bg-red-900 transition-colors animate-pulse">End & Verify</button>
                )}
              </div>
            </div>
          </div>

          {/* Vectors Display */}
          <div className="bg-gray-900/60 border border-cyan-500/30 p-4 rounded-lg backdrop-blur-sm text-xs space-y-4">
             <div>
               <h3 className="text-cyan-600 mb-1">BASELINE VECTOR (STORED)</h3>
               <div className="font-mono text-gray-400 break-all">
                 [{baselineVector?.map(v => v.toFixed(3)).join(', ')}]
               </div>
             </div>
             <div>
               <h3 className="text-cyan-600 mb-1">LIVE VECTOR (COMPUTED)</h3>
               <div className="font-mono text-gray-400 break-all">
                 {liveVector ? `[${liveVector.map(v => v.toFixed(3)).join(', ')}]` : '[ WAITING FOR TELEMETRY ]'}
               </div>
             </div>
             
             {liveVector && !isBaselineConfigured && (
               <button 
                 onClick={() => {
                   setBaselineVector(liveVector);
                   setIsBaselineConfigured(true);
                   setResult({ status: 'MATCH CONFIRMED', percentage: 100 });
                 }}
                 className="w-full mt-4 bg-cyan-950 border border-cyan-500/50 text-cyan-400 py-2 rounded hover:bg-cyan-900 transition-colors text-xs"
               >
                 SET LIVE AS BASELINE (FOR TESTING)
               </button>
             )}
          </div>
        </div>

        {/* Middle & Right Column: HUD */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mule Alert System */}
          <div className="h-32 flex items-center justify-center border border-cyan-500/20 bg-black/40 rounded-lg overflow-hidden relative">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`w-full h-full flex items-center justify-between px-10 border-l-4 ${getStatusColor(result.status)} bg-gradient-to-r from-current/10 to-transparent`}
                >
                  <div className="flex items-center gap-6">
                    {result.status === 'MATCH CONFIRMED' && <ShieldCheck className="w-16 h-16" />}
                    {result.status === 'RUSHED STATE (SAFE)' && <Shield className="w-16 h-16" />}
                    {result.status === 'MULE DETECTED' && <ShieldAlert className="w-16 h-16" />}
                    
                    <div>
                      <h2 className="text-3xl font-black tracking-widest drop-shadow-md">{result.status}</h2>
                      <p className="text-sm opacity-80 mt-1">BIOMETRIC SIMILARITY: {result.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-6xl font-bold opacity-20">
                    {result.percentage}%
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-cyan-800"
                >
                  <Radar className="w-10 h-10 mb-2 animate-[spin_3s_linear_infinite]" />
                  <span className="tracking-widest text-sm">AWAITING TELEMETRY PACKETS</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Telemetry Visualizer Grid */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Keystroke Dwell Times */}
            <div className="bg-gray-900/60 border border-cyan-500/30 p-4 rounded-lg backdrop-blur-sm h-64 flex flex-col">
              <h3 className="text-xs text-cyan-600 mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4" /> LIVE DWELL TIME STREAM</h3>
              <div className="flex-1 flex items-end gap-1 overflow-hidden relative border-b border-cyan-900 pb-1">
                {liveKeystrokes.map((stroke, i) => {
                  const height = Math.min(100, (stroke.duration / 300) * 100);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${height}%`, opacity: 1 }}
                      className="w-full bg-neon-green/80 flex items-end justify-center rounded-t-sm"
                      title={`${stroke.key}: ${stroke.duration}ms`}
                    >
                      <span className="text-[9px] text-black font-bold mb-1 -rotate-90 select-none hidden sm:block">{stroke.key}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Radar / Abstract representation */}
            <div className="bg-gray-900/60 border border-cyan-500/30 p-4 rounded-lg backdrop-blur-sm h-64 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]" />
                
                {/* Simplified Radar visual */}
                <div className="relative w-40 h-40 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full border border-cyan-500/10 scale-75" />
                  <div className="absolute w-full h-full rounded-full border border-cyan-500/10 scale-50" />
                  
                  {/* Radar sweep line */}
                  {isRecording && (
                    <motion.div 
                      className="absolute w-1/2 h-[1px] bg-gradient-to-r from-transparent to-neon-green origin-left left-1/2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  
                  {/* Plot points if result exists */}
                  {result && liveVector && (
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="-1 -1 2 2">
                       <polygon 
                         points={liveVector.map((v, i) => {
                           const angle = (Math.PI * 2 * i) / liveVector.length - Math.PI / 2;
                           const radius = v * 1.5; // Scale for visual
                           return `${Math.cos(angle) * radius},${Math.sin(angle) * radius}`;
                         }).join(' ')}
                         fill="rgba(57, 255, 20, 0.2)"
                         stroke="rgba(57, 255, 20, 0.8)"
                         strokeWidth="0.02"
                       />
                       {baselineVector && (
                         <polygon 
                           points={baselineVector.map((v, i) => {
                             const angle = (Math.PI * 2 * i) / baselineVector.length - Math.PI / 2;
                             const radius = v * 1.5; // Scale for visual
                             return `${Math.cos(angle) * radius},${Math.sin(angle) * radius}`;
                           }).join(' ')}
                           fill="transparent"
                           stroke="rgba(0, 255, 255, 0.5)"
                           strokeWidth="0.02"
                           strokeDasharray="0.05,0.05"
                         />
                       )}
                    </svg>
                  )}
                </div>
                <div className="mt-4 text-[10px] text-cyan-600 tracking-widest uppercase">
                  Vector Space Topology
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
