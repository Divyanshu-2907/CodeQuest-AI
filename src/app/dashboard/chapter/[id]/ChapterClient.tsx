"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Play, Lock, CheckCircle, ArrowLeft, Terminal, Cpu, Clock, Zap, Activity } from "lucide-react";
import { useKernel } from "@/os/kernel/KernelProvider";

export default function ChapterClient({ chapter, userMissions, dbUser }: any) {
  const kernel = typeof window !== 'undefined' ? useKernel() : null;
  const [mounted, setMounted] = useState(false);
  const hasTriggeredIntro = React.useRef(false);

  useEffect(() => {
    setMounted(true);
    // Simulate Ghost transmission when page loads
    if (kernel && !hasTriggeredIntro.current) {
      hasTriggeredIntro.current = true;
      setTimeout(() => {
        kernel.emit("AI_MESSAGE", {
          persona: "GHOST",
          message: `Agent, you've arrived at ${chapter.title}. I'm syncing the dossier now. Stay alert.`,
          type: "INFO"
        });
      }, 1000);
    }
  }, [kernel, chapter.title]);

  const totalXP = chapter.missions.reduce((acc: number, m: any) => acc + m.xpReward, 0);
  const completedMissions = chapter.missions.filter((m: any) => userMissions.some((um: any) => um.missionId === m.id && um.status === "COMPLETED")).length;
  const progress = Math.round((completedMissions / chapter.missions.length) * 100);

  // Generate deterministic "fake" metadata based on mission id for flavor
  const getMissionMetadata = (mission: any, idx: number) => {
    const difficulties = ["NOVICE", "STANDARD", "COMPLEX", "EXTREME"];
    const diffIdx = mission.type === "BOSS" ? 3 : (idx % 3);
    
    return {
      difficulty: difficulties[diffIdx],
      estTime: `${(idx + 1) * 5 + 10}m`,
      threat: mission.type === "BOSS" ? "HIGH" : "LOW",
      ai: "GHOST"
    };
  };

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      {/* Background Particles / Scanning Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,119,221,0.15),transparent_50%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-8 pt-8"
      >
        <Link href="/dashboard/city" className="inline-flex items-center text-xs font-mono tracking-widest text-[#7F77DD] hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          ABORT TO NEURAL CITY
        </Link>

        {/* Cinematic District Header */}
        <header className="relative border border-[#2A2A35]/50 bg-[#0A0A0E]/80 backdrop-blur-md rounded-xl p-8 overflow-hidden">
          {/* Scanning Laser Line */}
          <motion.div 
            className="absolute left-0 right-0 h-[1px] bg-[#7F77DD]/50 shadow-[0_0_10px_#7F77DD]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#8C8C9A]">
                <span className="text-[#7F77DD]">DISTRICT_0{chapter.number}</span>
                <span>//</span>
                <span className="flex items-center gap-2"><Activity size={12} className="text-amber-400" /> SEC_STATUS: COMPROMISED</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {chapter.title}
              </h1>
              
              {/* Ghost Holographic Briefing */}
              <div className="mt-6 flex gap-4 bg-white/5 border border-white/10 rounded-lg p-4 relative overflow-hidden">
                <div className="w-12 h-12 rounded bg-[#7F77DD]/20 border border-[#7F77DD]/50 flex items-center justify-center shrink-0">
                  <Terminal className="text-[#7F77DD]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#7F77DD] mb-1">GHOST_TRANSMISSION // SECURE</div>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    {chapter.lore}
                  </p>
                </div>
              </div>
            </div>

            {/* HUD Metrics */}
            <div className="flex flex-col justify-center gap-4 border-l border-white/10 pl-8">
              <div>
                <div className="text-[10px] font-mono text-[#8C8C9A] mb-1">TOTAL_XP_YIELD</div>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  <Shield size={20} className="text-amber-400" /> {totalXP}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#8C8C9A] mb-1">COMPLETION_RATE</div>
                <div className="text-2xl font-black text-[#5DCAA5] font-mono">{progress}%</div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-[#5DCAA5] rounded-full shadow-[0_0_10px_#5DCAA5]" 
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mission Dossier Timeline */}
        <div className="relative mt-12 pl-8">
          {/* The Neural Spine (Vertical Line) */}
          <div className="absolute left-[39px] top-4 bottom-0 w-[2px] bg-[#1C1C21]" />

          <div className="space-y-12">
            {chapter.missions.map((mission: any, idx: number) => {
              const userMission = userMissions.find((um: any) => um.missionId === mission.id);
              const isCompleted = userMission?.status === "COMPLETED";
              const isActive = userMission?.status === "ACTIVE";
              const isPlayable = isActive || isCompleted || mission.title.includes("1") || userMissions.length === 0;
              const isBoss = mission.type === "BOSS";
              const isProLocked = isBoss && !dbUser.isPro;
              const meta = getMissionMetadata(mission, idx);

              return (
                <motion.div 
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 + 0.5, type: "spring", stiffness: 100 }}
                  className="relative group"
                >
                  {/* Glowing Node on Spine */}
                  <div className={`absolute -left-[54px] top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-500
                    ${isCompleted ? 'bg-[#0A0A0E] border-[#5DCAA5]' : 
                      isPlayable && !isProLocked ? 'bg-[#0A0A0E] border-[#7F77DD] shadow-[0_0_15px_rgba(127,119,221,0.5)]' : 
                      'bg-[#0A0A0E] border-[#2A2A35]'}
                  `}>
                    {isCompleted ? <CheckCircle size={14} className="text-[#5DCAA5]" /> : 
                     isProLocked ? <Lock size={14} className="text-yellow-500" /> :
                     <div className={`w-2 h-2 rounded-full ${isPlayable ? 'bg-[#7F77DD]' : 'bg-[#2A2A35]'}`} />}
                  </div>

                  {/* Horizontal Connection Line */}
                  <div className={`absolute -left-[30px] top-[39px] w-[30px] h-[2px] z-0 transition-colors duration-500
                    ${isCompleted || (isPlayable && !isProLocked) ? 'bg-gradient-to-r from-[#7F77DD] to-transparent' : 'bg-[#1C1C21]'}
                  `} />

                  {/* Classified Dossier Panel */}
                  <div className={`relative ml-6 p-[1px] rounded-xl overflow-hidden
                    ${isProLocked ? 'bg-gradient-to-br from-yellow-500/20 to-transparent' : 
                      isPlayable ? 'bg-gradient-to-br from-[#7F77DD]/40 via-white/5 to-transparent' : 
                      'bg-gradient-to-br from-white/10 to-transparent'}
                  `}>
                    <div className="bg-[#0A0A0E]/95 backdrop-blur-xl rounded-[11px] p-6 h-full border border-white/5 relative overflow-hidden">
                      
                      {/* Top Metadata Strip */}
                      <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono uppercase tracking-widest mb-6 opacity-70">
                        <span className={`px-2 py-0.5 rounded border ${
                          isBoss ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-white/20 text-gray-300'
                        }`}>
                          TYPE: {mission.type}
                        </span>
                        <span className="flex items-center gap-1"><Cpu size={10} /> DIFF: {meta.difficulty}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> EST: {meta.estTime}</span>
                        <span className="flex items-center gap-1 text-amber-400"><Shield size={10} /> XP: {mission.xpReward}</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {mission.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-mono leading-relaxed line-clamp-2">
                            {mission.briefing}
                          </p>
                        </div>

                        {/* CTA Area */}
                        <div className="flex items-center justify-end lg:border-l border-white/10 lg:pl-6">
                          {isProLocked ? (
                            <Link href="/dashboard/upgrade" className="flex items-center justify-center gap-2 w-full py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded font-mono text-xs uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
                              <Lock size={14} /> PRO REQUIRED
                            </Link>
                          ) : isPlayable ? (
                            <Link href={`/dashboard/mission/${mission.id}`} className="group relative flex items-center justify-center gap-2 w-full py-4 bg-[#7F77DD]/10 border border-[#7F77DD]/30 text-[#7F77DD] rounded font-mono text-xs uppercase tracking-widest hover:bg-[#7F77DD] hover:text-white transition-all overflow-hidden">
                              {/* Hover sweep effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                              <Play size={14} className={isCompleted ? "fill-current" : ""} />
                              {isCompleted ? "REDEPLOY AGENT" : "▶ DEPLOY AGENT"}
                            </Link>
                          ) : (
                            <div className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/10 text-gray-600 rounded font-mono text-xs uppercase tracking-widest">
                              <Lock size={14} /> CLASSIFIED
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
