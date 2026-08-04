"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Database, Cpu, Network, Lock } from 'lucide-react';

export default function GatewayHUD() {
  const [metrics, setMetrics] = useState({
    cpu: 18,
    memory: 45,
    latency: 12,
    threat: "LOW"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 2 - 1))),
        latency: Math.min(50, Math.max(5, prev.latency + (Math.random() * 4 - 2)))
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Left Panel: Neural City Intel (Desktop Only) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 w-80 flex-col gap-6 z-20 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-black/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden"
        >
          {/* Holographic Wireframe Globe/City */}
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-[#7F77DD]/30 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute -top-6 -right-6 w-32 h-32 border border-[#5DCAA5]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-[#5DCAA5]" />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#5DCAA5] uppercase">Neural City</div>
              <div className="text-xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>Intel Hub</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Active Agents</span>
              <span className="text-lg font-mono text-white font-bold">14,204</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Nodes Compromised</span>
              <span className="text-lg font-mono text-[#7F77DD] font-bold">892,110</span>
            </div>
            <div className="flex justify-between items-end pb-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Global Threat</span>
              <span className="text-sm font-mono text-[#5DCAA5] font-bold tracking-widest bg-[#5DCAA5]/10 px-2 py-0.5 rounded border border-[#5DCAA5]/20">
                {metrics.threat}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10">
            <p className="text-xs font-mono text-gray-400 italic leading-relaxed">
              "The city never sleeps. Neither does the AI. Establish your uplink, Agent."
            </p>
            <div className="text-[9px] font-mono text-[#7F77DD] uppercase tracking-widest mt-2">— GHOST</div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Live Diagnostics (Desktop Only) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 w-80 flex-col gap-4 z-20 pointer-events-none">
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="bg-black/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-mono text-white tracking-widest uppercase">System Telemetry</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span className="flex items-center gap-1"><Cpu size={10}/> Core Engine</span>
                <span className="text-white">{Math.round(metrics.cpu)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-[#5DCAA5]" animate={{ width: `${metrics.cpu}%` }} transition={{ duration: 1 }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span className="flex items-center gap-1"><Database size={10}/> Memory Allocation</span>
                <span className="text-white">{Math.round(metrics.memory)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-[#7F77DD]" animate={{ width: `${metrics.memory}%` }} transition={{ duration: 1 }} />
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                <span className="flex items-center gap-2 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                  <Network size={12} className="text-cyan-400" /> Latency
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{Math.round(metrics.latency)}ms</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                <span className="flex items-center gap-2 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                  <Lock size={12} className="text-[#5DCAA5]" /> Encryption
                </span>
                <span className="text-xs font-mono text-[#5DCAA5] font-bold">MILITARY GRADE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small Event Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col gap-2 h-32 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7F77DD] to-transparent opacity-30" />
          <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Live Uplink
          </div>
          <div className="text-[10px] font-mono text-gray-400 leading-relaxed">
            <span className="text-[#5DCAA5]">{">"}</span> Establishing secure tunnel...<br/>
            <span className="text-[#5DCAA5]">{">"}</span> Validating neural pathways...<br/>
            <span className="text-[#5DCAA5]">{">"}</span> Awaiting agent credentials...
          </div>
        </motion.div>
      </div>
    </>
  );
}
