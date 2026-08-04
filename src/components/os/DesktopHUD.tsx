"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Clock, Terminal as TerminalIcon, Wifi, Cpu, Database, Network, Battery, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const FAKE_LOGS = [
  "Connecting to quantum relay...",
  "Packet received from Sector 04.",
  "Mission synced successfully.",
  "Database indexing complete.",
  "Ghost connected.",
  "Compiler cluster online.",
  "Warning: High memory usage in D-02.",
  "Bypassing firewall constraints.",
  "Neural link established.",
  "Running diagnostics...",
  "Vector database updated."
];

const FAKE_ACTIVITIES = [
  "Agent Vex decrypted a new payload.",
  "Sector 01 Threat Level decreased.",
  "Compiler node 4 synchronized.",
  "Incoming transmission from Architect.",
  "Atlas matrix recalibrated."
];

export function DesktopHUD() {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [neuralTime, setNeuralTime] = useState("NT-00.00");
  const [memory, setMemory] = useState(42);
  const [aiLoad, setAiLoad] = useState(18);
  const [logs, setLogs] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

  // System Diagnostics fluctuating loop
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
      setNeuralTime(`NT-${(Math.random() * 99).toFixed(2)}`);
    };
    updateTime();
    
    const int = setInterval(() => {
      updateTime();
      setMemory(prev => Math.min(100, Math.max(10, prev + (Math.random() * 10 - 5))));
      setAiLoad(prev => Math.min(100, Math.max(5, prev + (Math.random() * 8 - 4))));
    }, 1000);
    return () => clearInterval(int);
  }, []);

  // Mini Terminal Logging Loop
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, FAKE_LOGS[Math.floor(Math.random() * FAKE_LOGS.length)]];
        return newLogs.slice(-6); // keep last 6
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Activity Feed Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newAct = [...prev, FAKE_ACTIVITIES[Math.floor(Math.random() * FAKE_ACTIVITIES.length)]];
        return newAct.slice(-3); // keep last 3
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="fixed inset-0 z-10 pointer-events-none p-6 md:p-10 flex flex-col justify-between font-sans"
    >
      {/* Top HUD Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        
        {/* AGENT STATUS (Left Pane) */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, delay: 0.4 }}
          className="os-window p-4 flex flex-col gap-4 w-[280px] bg-[rgba(10,10,14,0.7)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold text-[#7F77DD] uppercase tracking-widest">Agent Status</span>
            <span className="text-[9px] bg-[#5DCAA5]/20 text-[#5DCAA5] px-2 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">Connected</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-sm bg-[rgba(127,119,221,0.1)] border border-[rgba(127,119,221,0.3)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#7F77DD]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <div className="text-sm font-black tracking-widest text-white uppercase">GUEST_AGENT</div>
              <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Lvl 1 - Rookie</div>
            </div>
          </div>

          <div className="space-y-3 mt-2">
            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span>Health</span>
                <span className="text-[#5DCAA5]">100%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#5DCAA5] w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span>Energy</span>
                <span className="text-yellow-500">84%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[84%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span>AI Trust Score</span>
                <span className="text-[#7F77DD]">92%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#7F77DD] w-[92%]" />
              </div>
            </div>
          </div>

          <div className="mt-2 p-3 bg-white/[0.02] border border-white/5 rounded-sm">
            <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Today's Objective</div>
            <div className="text-xs font-bold text-gray-300">Infiltrate Neural City Sector 01</div>
          </div>
        </motion.div>

        {/* SYSTEM STATUS (Right Pane) */}
        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, delay: 0.5 }}
          className="os-window p-4 flex flex-col gap-4 w-[280px] bg-[rgba(10,10,14,0.7)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">System Status</span>
            <span className="text-[9px] text-[#5DCAA5] flex items-center gap-1 font-mono uppercase tracking-widest">
              <Wifi className="w-3 h-3" /> STABLE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">Sys Time</span>
              <span className="text-sm font-mono font-bold text-[#E8E8F0] flex items-center gap-2">
                <Clock className="w-3 h-3 text-[#7F77DD]" /> {time || "00:00:00"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">Neural Time</span>
              <span className="text-sm font-mono font-bold text-[#AFA9EC]">
                {neuralTime}
              </span>
            </div>
          </div>

          <div className="space-y-3 mt-2">
            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> AI Load</span>
                <span className="text-yellow-500">{aiLoad.toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-yellow-500" 
                  animate={{ width: `${aiLoad}%` }} 
                  transition={{ type: "tween", ease: "linear", duration: 1 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Memory</span>
                <span className="text-[#5DCAA5]">{memory.toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#5DCAA5]" 
                  animate={{ width: `${memory}%` }} 
                  transition={{ type: "tween", ease: "linear", duration: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="p-2 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Compiler</span>
              <span className="text-xs font-bold text-gray-300">3 QUEUED</span>
            </div>
            <div className="p-2 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Threat Lvl</span>
              <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                <Activity className="w-3 h-3" /> ELEVATED
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Center Action (Neural Core) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.button 
          onClick={() => router.push("/dashboard/city")}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center justify-center w-[400px] h-[400px] rounded-full pointer-events-auto cursor-none"
        >
          {/* Volumetric glow */}
          <div className="absolute inset-0 bg-[#7F77DD]/5 rounded-full blur-[50px] group-hover:bg-[#7F77DD]/20 transition-colors duration-1000" />
          
          {/* Orbital rings */}
          <div className="absolute inset-8 border border-[rgba(127,119,221,0.1)] rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-16 border-2 border-dashed border-[rgba(93,202,165,0.2)] rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          <div className="absolute inset-24 border border-[rgba(255,255,255,0.05)] rounded-full animate-[spin_15s_linear_infinite]" />
          
          {/* Inner Core */}
          <div className="os-window w-48 h-48 rounded-full flex flex-col items-center justify-center gap-3 bg-[rgba(10,10,14,0.9)] border-[rgba(127,119,221,0.5)] group-hover:bg-[rgba(127,119,221,0.15)] transition-all duration-500 shadow-[0_0_50px_rgba(127,119,221,0.2)] group-hover:shadow-[0_0_80px_rgba(127,119,221,0.5)]">
            <TerminalIcon className="w-10 h-10 text-[#7F77DD] group-hover:text-white transition-colors duration-500" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black tracking-widest uppercase text-white mb-1">
                Neural Core
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#5DCAA5] uppercase animate-pulse">
                Online - 97% Stable
              </span>
            </div>
          </div>
          
          {/* Floating Particles (Fake via small divs) */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#7F77DD] rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0.5],
                x: Math.cos(i * 60) * 150,
                y: Math.sin(i * 60) * 150,
              }}
              transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.5, ease: "linear" }}
            />
          ))}
        </motion.button>
      </div>

      {/* Bottom Area (Live Feeds & Terminals) */}
      <div className="flex justify-between items-end pointer-events-none z-10 w-full mb-16">
        
        {/* Mini Terminal (Bottom Left) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="os-window w-[300px] h-[150px] bg-[rgba(10,10,14,0.8)] backdrop-blur-md flex flex-col overflow-hidden pointer-events-auto"
        >
          <div className="px-3 py-1.5 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
            <TerminalIcon className="w-3 h-3 text-gray-500" />
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Sys.Log Stream</span>
          </div>
          <div className="p-3 font-mono text-[9px] text-gray-400 flex flex-col justify-end flex-1 gap-1">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div 
                  key={i + log}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn("leading-relaxed", log.includes("Warning") ? "text-yellow-500" : "")}
                >
                  &gt; {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Live Activity Feed (Bottom Right/Center) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col gap-2 items-end pointer-events-auto max-w-sm"
        >
          <AnimatePresence>
            {activities.map((act, i) => (
              <motion.div
                key={i + act}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="px-4 py-2 bg-[rgba(10,10,14,0.8)] border border-white/10 rounded-sm backdrop-blur-md text-[10px] font-mono text-gray-300 flex items-center gap-3"
              >
                <Network className="w-3 h-3 text-[#7F77DD]" />
                {act}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  );
}
