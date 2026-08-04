"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useKernel } from '@/os/kernel/KernelProvider';

interface GhostCompanionProps {
  npcName: string;
  attemptCount: number;
  status: string;
}

export default function GhostCompanion({ npcName, attemptCount, status }: GhostCompanionProps) {
  const kernel = typeof window !== 'undefined' ? useKernel() : null;
  const [mood, setMood] = useState<'IDLE' | 'THINKING' | 'HAPPY' | 'WARNING'>('IDLE');
  const [currentMessage, setCurrentMessage] = useState("");
  const [ping, setPing] = useState(12);

  // Simulate network connection
  useEffect(() => {
    const timer = setInterval(() => {
      setPing(prev => Math.min(99, Math.max(5, prev + Math.floor(Math.random() * 6 - 3))));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // React to mission status changes
  useEffect(() => {
    if (status === "COMPLETED") {
      setMood('HAPPY');
      setCurrentMessage("Excellent execution. Node infiltrated. Waiting for your next move.");
    } else if (attemptCount > 2) {
      setMood('WARNING');
      setCurrentMessage("Watch your syntax, Agent. The corporate firewall is adapting to our intrusion attempts.");
    } else if (attemptCount === 1) {
      setMood('THINKING');
      setCurrentMessage("First payload rejected. Recalculate your algorithms and deploy again.");
    }
  }, [attemptCount, status]);

  // Listen to OS events for spontaneous reactions
  useEffect(() => {
    if (!kernel) return;
    const unsub = kernel.emit = new Proxy(kernel.emit, {
      apply: (target, thisArg, argumentsList) => {
        const [type, payload] = argumentsList;
        if (type === 'NEW_TRANSMISSION' && Math.random() > 0.5) {
          setMood('THINKING');
          setCurrentMessage("I'm picking up background chatter on the local network. Keep moving.");
          setTimeout(() => setMood('IDLE'), 5000);
        }
        return Reflect.apply(target, thisArg, argumentsList);
      }
    });
    // This proxying is a bit hacky for a component, but we rely on the parent for real events.
  }, [kernel]);

  return (
    <div className="h-full flex flex-col os-window bg-[rgba(10,10,14,0.95)] overflow-hidden relative">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 bg-[length:20px_20px]" />
      
      {/* Header */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#7F77DD]/20 border border-[#7F77DD]/50 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-[#7F77DD]">{npcName.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">{npcName} // ACTIVE</span>
            <span className="text-[8px] font-mono text-[#5DCAA5] uppercase tracking-widest flex items-center gap-1">
              <Wifi size={8} /> LINK STABLE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-gray-500 uppercase">LATENCY</span>
            <span className="text-[9px] font-mono text-[#5DCAA5] font-bold">{ping}ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-gray-500 uppercase">TRUST</span>
            <span className="text-[9px] font-mono text-[#7F77DD] font-bold">94%</span>
          </div>
        </div>
      </div>

      {/* Main Dialogue Area */}
      <div className="flex-1 p-5 relative z-10 flex flex-col justify-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage || 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-4"
          >
            {mood === 'THINKING' && (
              <div className="flex items-center gap-2 mb-2 text-[#7F77DD]">
                <Activity size={12} className="animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest">Processing...</span>
              </div>
            )}
            {mood === 'WARNING' && (
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <ShieldAlert size={12} />
                <span className="text-[9px] font-mono uppercase tracking-widest">Caution Advised</span>
              </div>
            )}
            {mood === 'HAPPY' && (
              <div className="flex items-center gap-2 mb-2 text-[#5DCAA5]">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-mono uppercase tracking-widest">Node Secured</span>
              </div>
            )}

            <div className="text-sm font-mono text-gray-300 leading-relaxed relative">
              {/* Typewriter text would go here, simplified to direct render for stability */}
              {currentMessage || "Surveillance cameras are patched into my feed. Tell me when you're ready to execute the payload."}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-3 bg-[#7F77DD] ml-1 align-middle" 
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Ambient Neural Pulse lines */}
        <div className="h-1 w-full flex items-center justify-between mt-4 opacity-30">
          <motion.div 
            className="h-full bg-gradient-to-r from-transparent via-[#7F77DD] to-transparent w-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
