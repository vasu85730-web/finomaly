"use client";

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CyberRadarBackground from '@/components/CyberRadarBackground';
import BiometricHUD from '@/components/BiometricHUD';
import LoadingSequence from '@/components/LoadingSequence';
import TrailerModal from '@/components/TrailerModal';
import AimModal from '@/components/AimModal';
import { Cpu, Zap, Activity, Code2, Users, Database } from 'lucide-react';

function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative py-20 px-6 z-10">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 border border-neon-orange/50 text-neon-orange text-xs font-mono mb-4 rounded-full bg-neon-orange/10">
            TEAM HACKFLUX
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-wider text-white">Inspired by <span className="text-cyan-400">Prasunethon 2.0</span></h2>
          <p className="text-gray-400 leading-relaxed text-lg max-w-3xl mx-auto">
            The mule account crisis is a multi-billion dollar problem. Inspired by the challenges presented at Prasunethon 2.0, Team Hackflux set out to build an invisible, zero-friction solution. We realize that traditional authentication relies on what you know. We rely on <span className="text-white font-bold">how you act</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            { name: "Charvi Naresh", role: "B.Tech Student", uni: "BPIT New Delhi" },
            { name: "Dolsi Bajaj", role: "B.Tech Student", uni: "MAIT New Delhi" },
            { name: "Vasu Sharma", role: "Dual Degree", uni: "DTU B.Tech & IIT Madras BS" }
          ].map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass p-6 rounded-xl border border-white/10 text-center hover:border-neon-orange/50 transition-colors group"
            >
              <div className="w-16 h-16 mx-auto bg-charcoal rounded-full mb-4 flex items-center justify-center border border-white/20 group-hover:border-neon-orange transition-colors">
                <Users className="w-8 h-8 text-gray-400 group-hover:text-neon-orange" />
              </div>
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-neon-orange text-xs font-mono mt-1">{member.role}</p>
              <p className="text-gray-500 text-sm mt-2">{member.uni}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InteractiveTechCard({ icon, title, desc, delay }: any) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className="relative bg-[#0a0a0a]/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 overflow-hidden group"
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.15), transparent 40%)`
        }}
      />
      <div className="relative z-10">
        <div className="text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function TechSection() {
  return (
    <section id="tech" className="min-h-screen flex items-center justify-center relative py-20 px-6 z-10">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1 border border-cyan-500/50 text-cyan-400 text-xs font-mono mb-4 rounded-full bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            TECH STACK
          </div>
          <h2 className="text-5xl font-black uppercase tracking-wider text-white">Under the <span className="text-neon-orange">Hood</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Cpu className="w-10 h-10" />, title: "Next.js 15 & React", desc: "Server-side rendering, API routes, and highly optimized frontend delivery." },
            { icon: <Zap className="w-10 h-10" />, title: "Framer Motion", desc: "Hardware-accelerated animations, fluid layout transitions, and 3D transforms." },
            { icon: <Activity className="w-10 h-10" />, title: "Vector Fingerprinting", desc: "Proprietary client-side telemetry capturing flight time, dwell time, and pointer trajectories." },
            { icon: <Database className="w-10 h-10" />, title: "Cosine Similarity", desc: "Mathematical evaluation of multi-dimensional biometric vectors with dynamic thresholds." },
            { icon: <Code2 className="w-10 h-10" />, title: "Tailwind CSS v4", desc: "Utility-first styling powering the dark-mode cyber-aesthetic and neon accents." }
          ].map((tech, i) => (
            <InteractiveTechCard key={i} {...tech} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 px-6 relative z-10 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-wider text-white">System <span className="text-cyan-400">Architecture</span></h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">How raw human interaction is converted into an impenetrable cryptographic lock.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="flex-1 p-6 border border-white/10 rounded-xl bg-charcoal text-center w-full">
            <div className="text-neon-orange font-mono text-xs mb-2">PHASE 1</div>
            <h3 className="text-white font-bold mb-2">Telemetry Capture</h3>
            <p className="text-gray-500 text-xs">Silent background recording of 45+ interaction variables via JS Event Listeners.</p>
          </motion.div>
          <div className="hidden md:block w-8 h-[2px] bg-cyan-500/50" />
          <motion.div whileHover={{ scale: 1.05 }} className="flex-1 p-6 border border-white/10 rounded-xl bg-charcoal text-center w-full">
            <div className="text-neon-orange font-mono text-xs mb-2">PHASE 2</div>
            <h3 className="text-white font-bold mb-2">Vector Normalization</h3>
            <p className="text-gray-500 text-xs">Mathematical mapping of raw data into a normalized N-dimensional biometric vector.</p>
          </motion.div>
          <div className="hidden md:block w-8 h-[2px] bg-cyan-500/50" />
          <motion.div whileHover={{ scale: 1.05 }} className="flex-1 p-6 border border-white/10 rounded-xl bg-charcoal text-center w-full">
            <div className="text-neon-orange font-mono text-xs mb-2">PHASE 3</div>
            <h3 className="text-white font-bold mb-2">Cosine Engine</h3>
            <p className="text-gray-500 text-xs">Next.js API route computes Cosine Distance against baseline to detect structural anomalies.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-32 px-6 bg-gradient-to-b from-transparent to-black/80 relative z-10 border-t border-white/5">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-wider text-white">Initialize <span className="text-neon-orange">Integration</span></h2>
        <p className="text-gray-400 mb-10">
          Deploy the Finomaly engine in your infrastructure. Contact us to discuss implementation, API access, or investment opportunities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
           <a href="mailto:vasu85730@gmail.com" className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors font-mono text-sm">vasu85730@gmail.com</a>
           <a href="mailto:ncharvi02@gmail.com" className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors font-mono text-sm">ncharvi02@gmail.com</a>
        </div>
        <div className="mt-8">
          <a href="#" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/50">
            Find us on Unstop
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function SupportSection() {
  return (
    <section id="support" className="py-20 px-6 bg-black relative z-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-10 text-white uppercase text-center">Support & FAQ</h2>
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-neon-orange font-bold text-lg mb-2">What if the user is having a "Bad Day"?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our Dynamic Tolerance Algorithm accounts for behavioral variances. If a user is rushing, distracted, or operating from an awkward angle, their vector similarity drops. Instead of locking them out, a score between 65%-84% triggers a "RUSHED STATE (SAFE)" flag. This completely avoids false-positives while still maintaining strict thresholds (&lt;65%) for actual Mule operators.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">Does this require physical biometrics?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No. The entire system is passive and behavioral. It relies purely on telemetry from standard input devices (keyboard, mouse, touchscreen) and does not require Face ID, fingerprint scanning, or hardware tokens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isAimModalOpen, setIsAimModalOpen] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <>
      <LoadingSequence />
      
      <div ref={containerRef} className="relative bg-[#050505] text-white selection:bg-neon-orange/30">
        <Header onAimClick={() => setIsAimModalOpen(true)} />
        
        <motion.div style={{ y: bgY }} className="fixed inset-0 z-0">
          <CyberRadarBackground />
        </motion.div>

        <main className="relative z-10">
          <Hero onWatchTrailer={() => setIsTrailerModalOpen(true)} onLoginClick={() => setIsLoginModalOpen(true)} />
          <AboutSection />
          <TechSection />
          <ArchitectureSection />
          <SupportSection />
          <ContactSection />
        </main>
        
        <Footer />
        
        {isLoginModalOpen && (
          <BiometricHUD onClose={() => setIsLoginModalOpen(false)} />
        )}

        <TrailerModal
          isOpen={isTrailerModalOpen}
          onClose={() => setIsTrailerModalOpen(false)}
        />
        
        <AimModal
          isOpen={isAimModalOpen}
          onClose={() => setIsAimModalOpen(false)}
        />
      </div>
    </>
  );
}
