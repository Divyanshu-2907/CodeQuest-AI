"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Play, Check, Shield, Lock, Code2, AlertTriangle, Crosshair, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import MissionHUD from "./os/MissionHUD";
import StatusBar from "./os/StatusBar";
import LiveConsole, { ConsoleMessage } from "./os/LiveConsole";
import GhostCompanion from "./os/GhostCompanion";
import { useKernel } from "@/os/kernel/KernelProvider";

export default function MissionRoomClient({ mission, userMissionStatus, isPro }: any) {
  const kernel = typeof window !== 'undefined' ? useKernel() : null;
  const [code, setCode] = useState(mission.starterCode || "");
  const [logs, setLogs] = useState<ConsoleMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runsRemaining, setRunsRemaining] = useState<number>(3);
  const [isJudging, setIsJudging] = useState(false);
  const [judgeFeedback, setJudgeFeedback] = useState<any>(null);
  const [status, setStatus] = useState(userMissionStatus);
  const [attemptCount, setAttemptCount] = useState(0);

  const addLog = (level: ConsoleMessage['level'], text: string) => {
    setLogs(prev => [...prev, { id: Math.random().toString(), level, text, timestamp: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    // Initial Boot Sequence
    setTimeout(() => addLog('SYSTEM', "Kernel connection established."), 500);
    setTimeout(() => addLog('NETWORK', `Handshake verified for node: ${mission.id}`), 1200);
    setTimeout(() => addLog('GHOST', `Agent. Corporate surveillance has intensified. Do not get detected.`), 2500);
    setTimeout(() => addLog('INFO', "Compiler ready."), 3500);
  }, []);

  const handleRunCode = async () => {
    setIsExecuting(true);
    addLog('NETWORK', "Uplinking to Neural Sandbox...");
    
    // Simulate payload execution pipeline
    setTimeout(() => addLog('INFO', "Encrypting payload..."), 600);
    setTimeout(() => addLog('INFO', "Injecting into local node..."), 1200);

    setJudgeFeedback(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, missionId: mission.id })
      });
      const data = await res.json();
      
      if (data.runsRemaining !== undefined) setRunsRemaining(data.runsRemaining);
      
      setTimeout(() => {
        if (data.error) {
          addLog('ERROR', data.error);
          if (!data.limitExceeded) setAttemptCount(prev => prev + 1);
        } else {
          const outStr = data.stdout + (data.stderr ? `\n[STDERR]: ${data.stderr}` : "");
          if (data.stderr) {
            addLog('WARNING', outStr);
            setAttemptCount(prev => prev + 1);
          } else {
            addLog('SUCCESS', "Execution nominal.");
            addLog('INFO', `OUTPUT:\n${outStr}`);
          }
        }
        setIsExecuting(false);
      }, 2000); // Simulate delay
    } catch (err) {
      setTimeout(() => {
        addLog('ERROR', "FATAL ERROR: Connection to Neural Sandbox lost.");
        setIsExecuting(false);
      }, 1500);
    }
  };

  const handleSubmit = async () => {
    if (!code) {
      addLog('WARNING', "Payload is empty. Write code before submission.");
      return;
    }
    
    setIsJudging(true);
    setJudgeFeedback(null);
    addLog('NETWORK', "Transmitting payload for validation...");

    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, output: "", missionId: mission.id })
      });
      const data = await res.json();
      
      setTimeout(() => {
        setJudgeFeedback(data);
        if (data.passed) {
          setStatus("COMPLETED");
          addLog('SUCCESS', "PAYLOAD ACCEPTED. Node compromised.");
          kernel?.emit('MISSION_COMPLETED');
        } else {
          addLog('ERROR', "PAYLOAD REJECTED. Security systems triggered.");
          setAttemptCount(prev => prev + 1);
        }
        setIsJudging(false);
      }, 1500);
    } catch (err) {
      addLog('ERROR', "Judge connection failed.");
      setIsJudging(false);
    }
  };

  const isProLocked = mission.type === "BOSS" && !isPro;

  return (
    <div className="absolute inset-0 flex flex-col font-sans overflow-hidden bg-[#050505]">
      {/* Visual Effects Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 bg-[length:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7F77DD]/5 to-transparent opacity-50" />
      </div>

      <MissionHUD score={judgeFeedback?.score || 0} status={status} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 pb-10 z-10 relative">
        
        {/* LEFT PANE: Briefing & Ghost */}
        <div className="w-full md:w-[30%] flex flex-col gap-4">
          
          {/* Classified Dossier */}
          <div className="flex-[3] os-window flex flex-col overflow-hidden bg-[rgba(10,10,14,0.8)] backdrop-blur-xl border border-[#7F77DD]/20 relative group">
            {/* Holographic scanning line */}
            <motion.div 
              className="absolute left-0 right-0 h-[2px] bg-[#7F77DD]/30 shadow-[0_0_10px_#7F77DD] z-50 pointer-events-none"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />
            {/* Neon Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#7F77DD]/50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#7F77DD]/50" />
            
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <span className="text-[10px] font-mono text-[#7F77DD] tracking-widest uppercase">CLASSIFIED // DOSSIER</span>
              <Shield className="w-4 h-4 text-[#7F77DD]" />
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div>
                <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">MISSION_ID: {mission.id.split('-')[0]}</div>
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {mission.title}
                </h1>
              </div>

              {/* Rich Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-3 rounded">
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">THREAT_LEVEL</div>
                  <div className={cn("text-xs font-black tracking-widest", mission.type === 'BOSS' ? "text-red-400" : "text-amber-400")}>
                    {mission.type === 'BOSS' ? 'CRITICAL' : 'ELEVATED'}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded">
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">XP_REWARD</div>
                  <div className="text-xs font-black tracking-widest text-[#5DCAA5]">+{mission.xpReward}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded">
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">AI_ASSIGNED</div>
                  <div className="text-xs font-black tracking-widest text-[#7F77DD]">GHOST</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded">
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">STATUS</div>
                  <div className={cn("text-xs font-black tracking-widest", status === 'COMPLETED' ? "text-[#5DCAA5]" : "text-gray-300")}>
                    {status}
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#5DCAA5] uppercase tracking-widest mb-3">
                  <Crosshair size={12} /> CURRENT OBJECTIVE
                </div>
                <p className="text-sm text-gray-300 font-mono leading-relaxed">
                  {mission.briefing}
                </p>
              </div>
            </div>
          </div>

          {/* Ghost Emotional Panel */}
          <div className="flex-[2] min-h-[200px]">
            <GhostCompanion npcName="Ghost" attemptCount={attemptCount} status={status} />
          </div>
        </div>

        {/* RIGHT PANE: Code & Terminal */}
        <div className="w-full md:w-[70%] flex flex-col gap-4">
          
          {/* Hacking IDE */}
          <div className="flex-[2] os-window flex flex-col overflow-hidden bg-[rgba(10,10,14,0.9)] border border-white/10 relative">
            {/* Executing Pulse Effect */}
            <AnimatePresence>
              {isExecuting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-50 border-2 border-[#7F77DD]/50 bg-[#7F77DD]/5 shadow-[inset_0_0_50px_rgba(127,119,221,0.2)]"
                />
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between p-2 px-4 border-b border-[rgba(255,255,255,0.05)] bg-black/60">
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-[#7F77DD]" />
                <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">payload_injector.py</span>
              </div>
              <button 
                onClick={handleRunCode}
                disabled={isExecuting}
                className="group relative flex items-center gap-2 px-6 py-1.5 bg-[#7F77DD]/10 hover:bg-[#7F77DD] text-[#7F77DD] hover:text-white border border-[#7F77DD]/30 transition-all duration-300 disabled:opacity-50 text-[10px] font-black tracking-widest uppercase overflow-hidden cursor-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                {isExecuting ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                {isExecuting ? "EXECUTING..." : "EXECUTE"}
              </button>
            </div>
            
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "var(--font-jetbrains)",
                  padding: { top: 24, bottom: 24 },
                  scrollBeyondLastLine: false,
                  lineHeight: 1.8,
                  cursorBlinking: "phase",
                  cursorSmoothCaretAnimation: "on",
                  cursorWidth: 2,
                  smoothScrolling: true,
                  renderLineHighlight: "all",
                }}
              />
            </div>
          </div>

          {/* Live Console */}
          <div className="flex-1 min-h-[250px] os-window flex flex-col overflow-hidden bg-black/80 border border-white/10">
            <div className="flex items-center justify-between p-2 px-4 border-b border-[rgba(255,255,255,0.1)] bg-white/5">
              <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase flex items-center gap-2">
                <ChevronRight size={14} className="text-[#5DCAA5]" /> TERMINAL_UPLINK
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSubmit}
                  disabled={isJudging || status === "COMPLETED"}
                  className={cn(
                    "group relative px-8 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-none overflow-hidden",
                    isJudging ? "bg-white/10 text-white/50 border border-white/20" :
                    status === "COMPLETED" ? "bg-[#5DCAA5]/20 text-[#5DCAA5] border border-[#5DCAA5]/40" :
                    "bg-[#5DCAA5]/10 text-[#5DCAA5] hover:bg-[#5DCAA5] hover:text-black border border-[#5DCAA5]/40 shadow-[0_0_15px_rgba(93,202,165,0.2)]"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                  {isJudging ? "EVALUATING..." : status === "COMPLETED" ? "NODE CLEARED" : "DEPLOY TO JUDGE"}
                </button>
              </div>
            </div>
            
            <LiveConsole logs={logs} />
            
            {/* Judge Feedback Popup */}
            <AnimatePresence>
              {judgeFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "100%" }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-white/10"
                >
                  <div className={cn(
                    "font-black text-sm uppercase tracking-wider mb-2",
                    judgeFeedback.passed ? "text-[#5DCAA5]" : "text-red-400"
                  )}>
                    {judgeFeedback.passed ? "MISSION PASSED" : "MISSION FAILED"}
                  </div>
                  <div className="text-gray-400 font-mono text-xs">
                    {judgeFeedback.feedback || judgeFeedback.error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <StatusBar chapterTitle={mission.chapter?.title || "SYSTEM"} missionTitle={mission.title} />
    </div>
  );
}
