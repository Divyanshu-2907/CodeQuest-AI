"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Network, Layers, ShieldAlert } from 'lucide-react';

export default function SystemMonitorHUD() {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    gpu: 4,
    mem: 41,
    dbLoad: 8,
    inference: 120,
    network: 99.8
  });

  const requestRef = useRef<number>(0);

  const updateMetrics = () => {
    setMetrics(prev => ({
      cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 4 - 2))),
      gpu: Math.min(100, Math.max(0, prev.gpu + (Math.random() * 2 - 1))),
      mem: Math.min(100, Math.max(0, prev.mem + (Math.random() * 1 - 0.5))),
      dbLoad: Math.min(100, Math.max(0, prev.dbLoad + (Math.random() * 6 - 3))),
      inference: Math.min(500, Math.max(50, prev.inference + (Math.random() * 20 - 10))),
      network: 99.9
    }));
    requestRef.current = setTimeout(updateMetrics, 1500) as unknown as number;
  };

  useEffect(() => {
    requestRef.current = setTimeout(updateMetrics, 1500) as unknown as number;
    return () => clearTimeout(requestRef.current);
  }, []);

  const StatBar = ({ label, value, color = "bg-[#7F77DD]" }: { label: string, value: number, color?: string }) => (
    <div>
      <div className="flex justify-between text-[9px] font-mono text-[#8C8C9A] uppercase tracking-widest mb-1">
        <span>{label}</span>
        <span className="text-white">{Math.round(value)}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`} 
          animate={{ width: `${value}%` }} 
          transition={{ ease: "linear", duration: 1.5 }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-72 flex flex-col gap-4 z-20 pointer-events-none">
      
      {/* Global Status Banner */}
      <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-white/5 rounded-xl p-4 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Global Network</span>
          <span className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-pulse shadow-[0_0_10px_#5DCAA5]" />
        </div>
        <div className="text-2xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>STABLE</div>
      </div>

      {/* Core Hardware Metrics */}
      <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-[#2A2A35]/50 rounded-xl p-5 space-y-5 pointer-events-auto">
        <div className="flex items-center gap-2 text-[10px] font-mono text-white tracking-widest uppercase mb-2 border-b border-white/5 pb-2">
          <Cpu size={12} className="text-gray-400" /> Hardware Telemetry
        </div>
        <StatBar label="CPU_LOAD" value={metrics.cpu} color="bg-[#5DCAA5]" />
        <StatBar label="GPU_ALLOC" value={metrics.gpu} color="bg-[#7F77DD]" />
        <StatBar label="MEM_USAGE" value={metrics.mem} color="bg-amber-400" />
      </div>

      {/* Cluster Services */}
      <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-[#2A2A35]/50 rounded-xl p-5 pointer-events-auto">
        <div className="flex items-center gap-2 text-[10px] font-mono text-white tracking-widest uppercase mb-4 border-b border-white/5 pb-2">
          <Layers size={12} className="text-gray-400" /> Active Services
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#8C8C9A]">ATLAS_ENGINE</span>
            <span className="text-[#5DCAA5] font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#8C8C9A]">GHOST_INTERFACE</span>
            <span className="text-[#5DCAA5] font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#8C8C9A]">VECTOR_DB</span>
            <span className="text-amber-400 font-bold">INDEXING</span>
          </div>
        </div>
      </div>

      {/* Network Traffic */}
      <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-[#2A2A35]/50 rounded-xl p-5 pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#8C8C9A] tracking-widest uppercase">Inference Speed</span>
            <span className="text-lg font-mono text-white font-bold">{Math.round(metrics.inference)} <span className="text-xs text-gray-500">t/s</span></span>
          </div>
          <Network size={20} className="text-[#7F77DD] opacity-50" />
        </div>
      </div>

    </div>
  );
}
