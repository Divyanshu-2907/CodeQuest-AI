"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Crosshair, Cpu, X, Play, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ChapterWithStatus = {
  id: string;
  number: number;
  title: string;
  lore: string;
  unlockXp: number;
  status: "COMPLETED" | "CURRENT" | "LOCKED";
};

// Hardcoded coordinates for the map layout (Zig-Zag ascending)
const NODE_POSITIONS = [
  { x: 150, y: 600 },
  { x: 450, y: 400 },
  { x: 750, y: 550 },
  { x: 1050, y: 300 },
  { x: 1350, y: 150 },
];

const npcNames = ["Ghost", "Vex", "Nexus", "Cipher", "The Architect"];
const npcColors = ["#5DCAA5", "#FAC775", "#7F77DD", "#F0997B", "#E24B4A"];

export default function ChapterMap({
  chapters,
  isPro,
}: {
  chapters: ChapterWithStatus[];
  isPro: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // Generate SVG path points
  const points = NODE_POSITIONS.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="absolute inset-0 overflow-hidden" ref={containerRef}>
      
      {/* Draggable Map Canvas */}
      <motion.div
        drag
        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
        dragElastic={0.1}
        initial={{ x: 0, y: 0 }}
        className="absolute inset-0 w-[2000px] h-[1000px] cursor-grab active:cursor-grabbing"
      >
        {/* SVG Neural Pathways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <polyline
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          {chapters.map((_, i) => {
            if (i === 0) return null;
            const prev = NODE_POSITIONS[i - 1];
            const curr = NODE_POSITIONS[i];
            const prevStatus = chapters[i - 1]?.status;
            
            // If the previous node is completed, the path to the current is "unlocked/active"
            const isActivePath = prevStatus === "COMPLETED";

            return isActivePath ? (
              <motion.line
                key={`line-${i}`}
                x1={prev.x}
                y1={prev.y}
                x2={curr.x}
                y2={curr.y}
                stroke="url(#activeGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            ) : null;
          })}
          
          <defs>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7F77DD" />
              <stop offset="100%" stopColor="#5DCAA5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Map Nodes */}
        {chapters.map((chapter, idx) => {
          const pos = NODE_POSITIONS[idx];
          const isProLocked = (chapter.number === 4 || chapter.number === 5) && !isPro;
          const isCompleted = chapter.status === "COMPLETED";
          const isCurrent = chapter.status === "CURRENT";
          const isLocked = chapter.status === "LOCKED" || isProLocked;

          return (
            <motion.div
              key={chapter.id}
              className="absolute z-10 flex flex-col items-center group cursor-none"
              style={{ left: pos.x, top: pos.y, x: "-50%", y: "-50%" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: idx * 0.1 }}
              onClick={() => setSelectedNode(idx)}
            >
              <motion.div 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors duration-300 backdrop-blur-md",
                  isCompleted ? "bg-[rgba(29,158,117,0.1)] border-[#5DCAA5] shadow-[0_0_20px_rgba(29,158,117,0.3)]" :
                  isCurrent ? "bg-[rgba(127,119,221,0.2)] border-[#7F77DD] shadow-[0_0_30px_rgba(127,119,221,0.5)]" :
                  "bg-[rgba(255,255,255,0.02)] border-[#2A2A35]"
                )}
              >
                {isCompleted && <Crosshair className="w-6 h-6 text-[#5DCAA5]" />}
                {isCurrent && <ShieldAlert className="w-6 h-6 text-[#7F77DD]" />}
                {isLocked && <Lock className="w-5 h-5 text-[#6B6A72]" />}
                
                {/* Ping animation for current node */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-[#7F77DD] opacity-20 animate-ping pointer-events-none" />
                )}
              </motion.div>
              
              {/* Floating Label */}
              <div className="mt-3 bg-[#0A0A0E]/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-[10px] font-mono tracking-widest text-center whitespace-nowrap">
                <span className={cn(isCompleted ? "text-[#5DCAA5]" : isCurrent ? "text-[#7F77DD]" : "text-[#6B6A72]")}>
                  D0{chapter.number}: 
                </span>
                <span className="text-white ml-1">{chapter.title}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Intelligence Dossier Side Panel */}
      <AnimatePresence>
        {selectedNode !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedNode(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[400px] max-w-full z-40 bg-[rgba(10,10,14,0.95)] border-l border-[rgba(255,255,255,0.1)] p-8 flex flex-col os-window"
            >
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-none"
              >
                <X className="w-5 h-5" />
              </button>

              {(() => {
                const chapter = chapters[selectedNode];
                const npc = npcNames[selectedNode] ?? "Unknown";
                const npcColor = npcColors[selectedNode] ?? "#6B6A72";
                const isProLocked = (chapter.number === 4 || chapter.number === 5) && !isPro;

                return (
                  <div className="flex flex-col h-full">
                    <div className="text-[10px] font-mono text-[#7F77DD] tracking-widest uppercase mb-2">
                      Intelligence Dossier
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">
                      {chapter.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="border border-white/10 rounded-lg p-3 bg-white/[0.02]">
                        <div className="text-[9px] font-mono text-gray-500 mb-1 uppercase">Threat Level</div>
                        <div className="text-sm font-bold text-yellow-500 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" /> HIGH
                        </div>
                      </div>
                      <div className="border border-white/10 rounded-lg p-3 bg-white/[0.02]">
                        <div className="text-[9px] font-mono text-gray-500 mb-1 uppercase">XP Reward</div>
                        <div className="text-sm font-bold text-[#5DCAA5] flex items-center gap-2">
                          <Cpu className="w-4 h-4" /> {chapter.unlockXp} XP
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-[9px] font-mono text-gray-500 mb-2 uppercase">Mission Briefing</div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {chapter.lore}
                      </p>

                      <div className="mt-8 p-4 rounded-lg border" style={{ borderColor: `${npcColor}40`, backgroundColor: `${npcColor}10` }}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-black" style={{ backgroundColor: `${npcColor}30`, color: npcColor }}>
                            {npc[0]}
                          </div>
                          <span className="font-mono text-xs font-bold" style={{ color: npcColor }}>{npc} [AI ASSISTANT]</span>
                        </div>
                        <p className="text-xs text-gray-300 italic">
                          "I'll be monitoring your connection. Don't fry the mainframe."
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10">
                      {isProLocked ? (
                        <Link 
                          href="/dashboard/upgrade"
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-[rgba(250,199,117,0.15)] text-[#FAC775] border border-[#FAC775]/40 hover:bg-[#FAC775]/20 transition-all active:scale-95 cursor-none"
                        >
                          <Zap className="w-4 h-4" /> REQUIRES ULTIMATE CLEARANCE
                        </Link>
                      ) : chapter.status === "LOCKED" ? (
                        <button disabled className="w-full py-4 rounded-xl text-sm font-bold bg-white/5 text-gray-500 flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" /> DISTRICT LOCKED
                        </button>
                      ) : (
                        <Link 
                          href={`/dashboard/chapter/${chapter.id}`}
                          className="w-full group flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black tracking-widest uppercase bg-[#7F77DD] text-white hover:bg-[#7F77DD]/80 transition-all active:scale-95 shadow-[0_0_20px_rgba(127,119,221,0.4)] cursor-none"
                        >
                          <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                          Begin Infiltration
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
