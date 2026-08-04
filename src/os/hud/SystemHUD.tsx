"use client";

import React, { useState, useEffect } from 'react';
import { useKernel } from '../kernel/KernelProvider';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SystemHUD() {
  const { state } = useKernel();
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memoryUsage, setMemoryUsage] = useState(42);
  const pathname = usePathname();

  // Simulate hardware metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 15) - 5;
        return Math.min(100, Math.max(0, prev + delta));
      });
      setMemoryUsage(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(100, Math.max(0, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Hide the HUD on pages where it causes clutter
  if (pathname.includes('/dashboard/mission')) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Top Left: Metrics */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <div className="text-[9px] uppercase font-mono tracking-widest text-[#8C8C9A]">
          SYS_TIME // <span className="text-white">{state.systemTime}</span>
        </div>
        <div className="text-[9px] uppercase font-mono tracking-widest text-[#8C8C9A] flex items-center gap-2">
          CPU <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#5DCAA5]" 
              animate={{ width: `${cpuUsage}%` }} 
              transition={{ ease: "linear", duration: 2 }}
            />
          </div> {cpuUsage}%
        </div>
        <div className="text-[9px] uppercase font-mono tracking-widest text-[#8C8C9A] flex items-center gap-2">
          MEM <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#7F77DD]" 
              animate={{ width: `${memoryUsage}%` }} 
              transition={{ ease: "linear", duration: 2 }}
            />
          </div> {memoryUsage}%
        </div>
      </div>

      {/* Top Right: Threat Level */}
      <div className="absolute top-6 right-6 flex flex-col items-end gap-1 opacity-50">
        <div className="text-[9px] uppercase font-mono tracking-widest text-[#8C8C9A]">
          THREAT_LEVEL
        </div>
        <motion.div 
          key={state.threatLevel}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-[10px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 rounded
            ${state.threatLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
              state.threatLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
              state.threatLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
              'bg-green-500/20 text-green-500 border border-green-500/30'
            }
          `}
        >
          {state.threatLevel}
        </motion.div>
      </div>
      
      {/* Target Reticles (Corners) */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10" />
    </div>
  );
}
