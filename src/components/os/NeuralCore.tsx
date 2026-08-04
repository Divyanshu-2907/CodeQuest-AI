"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function NeuralCore() {
  return (
    <div className="relative w-96 h-96 flex items-center justify-center group z-10">
      
      {/* Interactive Hitbox / Container */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center cursor-crosshair"
        whileHover="hover"
      >
        {/* Core Glow */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#7F77DD] blur-[100px] opacity-20 pointer-events-none"
          variants={{
            hover: { opacity: 0.5, scale: 1.2, transition: { duration: 1 } }
          }}
        />

        {/* Central Sphere */}
        <div className="absolute w-32 h-32 rounded-full border border-[#7F77DD]/50 bg-[#0A0A0E] shadow-[0_0_30px_rgba(127,119,221,0.3)] flex items-center justify-center overflow-hidden z-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-[length:10px_10px] animate-[spin_20s_linear_infinite]" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#7F77DD]/20 to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] font-mono tracking-widest text-[#7F77DD] font-bold">CORE</span>
            <span className="text-xs font-black tracking-widest text-[#5DCAA5]">ONLINE</span>
          </div>
        </div>

        {/* Orbital Ring 1 (Inner) */}
        <motion.div 
          className="absolute w-48 h-48 rounded-full border border-dashed border-[#5DCAA5]/30 z-10"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          variants={{
            hover: { scale: 1.1, border: "1px dashed rgba(93,202,165,0.6)", transition: { duration: 0.5 } }
          }}
        >
          {/* Satellite */}
          <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[#5DCAA5] rounded-full shadow-[0_0_10px_#5DCAA5]" />
        </motion.div>

        {/* Orbital Ring 2 (Middle) */}
        <motion.div 
          className="absolute w-64 h-64 rounded-full border border-[#7F77DD]/20 z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          variants={{
            hover: { scale: 1.15, border: "1px solid rgba(127,119,221,0.5)", transition: { duration: 0.6 } }
          }}
        >
          {/* Data Nodes */}
          <div className="absolute top-1/4 left-0 w-1.5 h-1.5 bg-[#7F77DD] rounded-full shadow-[0_0_10px_#7F77DD]" />
          <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 bg-[#7F77DD] rounded-full shadow-[0_0_10px_#7F77DD]" />
        </motion.div>

        {/* Orbital Ring 3 (Outer Hexagon / Tech Ring) */}
        <motion.svg 
          className="absolute w-80 h-80 z-10 text-white/5" 
          viewBox="0 0 100 100"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          variants={{
            hover: { scale: 1.2, color: "rgba(255,255,255,0.2)", transition: { duration: 0.7 } }
          }}
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </motion.svg>

        {/* Floating Tooltip Status (Only visible on hover) */}
        <motion.div 
          className="absolute top-full mt-8 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          variants={{
            hover: { y: 10, opacity: 1 }
          }}
        >
          <div className="text-[10px] font-mono tracking-widest text-[#8C8C9A] uppercase bg-black/60 px-3 py-1 rounded border border-white/10 backdrop-blur">
            Stability: 99.98%
          </div>
          <div className="flex gap-2 text-[8px] font-mono tracking-widest text-white/50 uppercase mt-1">
            <span>Atlas [OK]</span>
            <span>Ghost [OK]</span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
