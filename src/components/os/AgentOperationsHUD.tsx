"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AgentOperationsHUD() {
  const [energy, setEnergy] = useState(87);
  const [trust, setTrust] = useState(94);

  useEffect(() => {
    // Slight fluctuations for realism
    const timer = setInterval(() => {
      setEnergy(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 3 - 1))));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-72 flex flex-col gap-6 z-20 pointer-events-none">
      
      {/* Agent Profile Block */}
      <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-[#2A2A35]/50 rounded-xl p-5 relative overflow-hidden pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7F77DD]/10 blur-2xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-[#2A2A35] border border-white/10 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7F77DD]/30 to-transparent" />
            <span className="font-black text-xl text-white relative z-10" style={{ fontFamily: 'Orbitron, sans-serif' }}>A1</span>
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#7F77DD] uppercase">CLEARANCE LEVEL 1</div>
            <div className="text-xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>Agent_004</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[9px] font-mono text-[#8C8C9A] uppercase tracking-widest mb-1">
              <span>Energy Reserves</span>
              <span className="text-amber-400">{energy}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-amber-400" animate={{ width: `${energy}%` }} transition={{ duration: 1 }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-[#8C8C9A] uppercase tracking-widest mb-1">
              <span>System Trust</span>
              <span className="text-[#5DCAA5]">{trust}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#5DCAA5]" animate={{ width: `${trust}%` }} transition={{ duration: 1 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pointer-events-auto">
        <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-white/5 rounded-lg p-4 hover:border-[#7F77DD]/30 transition-colors">
          <Shield className="w-4 h-4 text-amber-400 mb-2" />
          <div className="text-[9px] font-mono text-[#8C8C9A] uppercase tracking-widest">Network XP</div>
          <div className="text-xl font-black text-white font-mono">1,402</div>
        </div>
        <div className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-white/5 rounded-lg p-4 hover:border-[#5DCAA5]/30 transition-colors">
          <Activity className="w-4 h-4 text-[#5DCAA5] mb-2" />
          <div className="text-[9px] font-mono text-[#8C8C9A] uppercase tracking-widest">Active Streak</div>
          <div className="text-xl font-black text-white font-mono">4 <span className="text-xs text-gray-500">DAYS</span></div>
        </div>
      </div>

      {/* Active Assignment */}
      <Link 
        href="/dashboard/city"
        className="bg-[#0A0A0E]/80 backdrop-blur-xl border border-[#5DCAA5]/20 rounded-xl p-5 pointer-events-auto block relative overflow-hidden group cursor-none hover:border-[#5DCAA5]/50 transition-colors"
      >
        <div className="absolute inset-0 bg-[#5DCAA5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#5DCAA5] uppercase tracking-widest mb-3 relative z-10">
          <Target size={12} className="animate-pulse" /> Current Objective
        </div>
        <h3 className="text-white font-bold mb-1 relative z-10 group-hover:text-[#5DCAA5] transition-colors">District 01: The Awakening</h3>
        <p className="text-xs text-gray-400 font-mono leading-relaxed mb-4 relative z-10">
          Establish local node connection and bypass early corporate firewalls.
        </p>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
          <motion.div className="h-full bg-[#5DCAA5]" initial={{ width: 0 }} animate={{ width: "33%" }} transition={{ duration: 1, delay: 0.5 }} />
        </div>
      </Link>

    </div>
  );
}
