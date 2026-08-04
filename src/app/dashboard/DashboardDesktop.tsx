"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NeuralCore from '@/components/os/NeuralCore';
import AgentOperationsHUD from '@/components/os/AgentOperationsHUD';
import SystemMonitorHUD from '@/components/os/SystemMonitorHUD';
import SystemEventStream from '@/components/os/SystemEventStream';
import { useKernel } from '@/os/kernel/KernelProvider';

export default function DashboardDesktop() {
  const { openWindow } = useKernel();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full h-full relative z-10 bg-[#050505] overflow-hidden">
      
      {/* Dense Particle & Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-[length:30px_30px]" />
        
        {/* Volumetric Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(127,119,221,0.1)_0%,transparent_70%)] rounded-full blur-[50px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(93,202,165,0.05)_0%,transparent_70%)] rounded-full blur-[50px]" />

        {/* Floating Particles */}
        <motion.div 
          className="absolute inset-0"
          animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Main HUD Layout */}
      <div className="absolute inset-0 flex items-center justify-between px-8 py-8 z-10 pointer-events-none">
        
        {/* Left Side: Agent Operations */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <AgentOperationsHUD />
        </motion.div>

        {/* Right Side: System Monitor */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
        >
          <SystemMonitorHUD />
        </motion.div>
      </div>

      {/* Center: Neural Core */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <NeuralCore />
        </motion.div>
      </div>

      {/* Bottom Left: Event Stream */}
      <SystemEventStream />

    </div>
  );
}
