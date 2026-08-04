"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Clock, Shield } from 'lucide-react';

export default function MissionHUD({ score, status }: { score: number, status: string }) {
  const [cpu, setCpu] = useState(12);
  const [mem, setMem] = useState(41);
  const [latency, setLatency] = useState(12);
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      // Simulate hardware metrics
      setCpu(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 10 - 5))));
      setMem(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 4 - 2))));
      setLatency(prev => Math.min(150, Math.max(8, prev + Math.floor(Math.random() * 10 - 5))));

      // Update mission time
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const s = (elapsed % 60).toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
      className="fixed right-4 top-24 w-48 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-4 flex flex-col gap-4 pointer-events-none z-40 shadow-2xl"
    >
      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#8C8C9A] border-b border-white/10 pb-2">
        <span>MISSION_HUD</span>
        <Activity size={12} className="text-[#5DCAA5]" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[9px] font-mono text-gray-400 mb-1">
            <span>CPU_LOAD</span>
            <span>{cpu}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#7F77DD]" animate={{ width: `${cpu}%` }} transition={{ duration: 1 }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[9px] font-mono text-gray-400 mb-1">
            <span>MEM_ALLOC</span>
            <span>{mem}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-amber-400" animate={{ width: `${mem}%` }} transition={{ duration: 1 }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-gray-400">LATENCY</span>
          <span className="text-[10px] font-mono font-bold text-[#5DCAA5]">{latency}ms</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-gray-400">EXEC_TIME</span>
          <span className="text-[10px] font-mono font-bold text-white">{time}</span>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[9px] font-mono text-[#7F77DD] tracking-widest">RANK SCORE</span>
        <span className="text-xs font-black font-mono text-white flex items-center gap-1">
          <Shield size={10} className="text-amber-400" /> {score}
        </span>
      </div>
    </motion.div>
  );
}
