"use client";

import { motion } from "framer-motion";
import { CheckCircle, Lock, Play, Zap } from "lucide-react";
import Link from "next/link";

export type ChapterWithStatus = {
  id: string;
  number: number;
  title: string;
  lore: string;
  unlockXp: number;
  status: "COMPLETED" | "CURRENT" | "LOCKED";
};

const npcNames = ["Ghost", "Vex", "Nexus", "Cipher", "The Architect"];
const npcColors = ["#5DCAA5", "#FAC775", "#7F77DD", "#F0997B", "#E24B4A"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
} as const;

export default function ChapterMap({
  chapters,
  isPro,
}: {
  chapters: ChapterWithStatus[];
  isPro: boolean;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col md:flex-row md:overflow-x-auto gap-4 pb-8 snap-x custom-scrollbar"
    >
      {chapters.map((chapter, idx) => {
        const isProLocked = (chapter.number === 4 || chapter.number === 5) && !isPro;
        const npc = npcNames[idx] ?? "Unknown";
        const npcColor = npcColors[idx] ?? "#6B6A72";

        return (
          <motion.div
            key={chapter.id}
            variants={item}
            className="md:min-w-[300px] md:max-w-[300px] snap-center shrink-0"
          >
            {/* ── Pro locked ── */}
            {isProLocked ? (
              <div className="h-full flex flex-col p-5 rounded-2xl relative overflow-hidden circuit-border glass-panel opacity-70 hover:opacity-100 transition-opacity" style={{ border: "1px solid rgba(250,199,117,0.2)" }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(250,199,117,0.3)" }} />
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: "#FAC775" }}
                  >
                    DISTRICT 0{chapter.number} · PRO
                  </span>
                  <Lock className="w-4 h-4" style={{ color: "#FAC775" }} />
                </div>
                <h3 className="text-lg font-black tracking-tight mb-2" style={{ color: "#555" }}>
                  {chapter.title}
                </h3>
                <p className="text-xs leading-relaxed flex-1 mb-5 line-clamp-3" style={{ color: "#444" }}>
                  {chapter.lore}
                </p>
                <Link
                  href="/dashboard/upgrade"
                  className="flex items-center justify-center gap-2 py-2 rounded text-xs font-bold tracking-wider transition-all hover:opacity-90"
                  style={{
                    background: "rgba(250,199,117,0.1)",
                    color: "#FAC775",
                    border: "1px solid rgba(250,199,117,0.3)",
                  }}
                >
                  <Zap className="w-3 h-3" /> UNLOCK WITH PRO
                </Link>
              </div>
            ) : chapter.status === "COMPLETED" ? (
              /* ── Completed ── */
              <Link href={`/dashboard/chapter/${chapter.id}`} className="block h-full">
                <div className="h-full flex flex-col p-5 rounded-2xl relative overflow-hidden card-lift glass-panel hover:glass-active transition-all duration-300">
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "rgba(127,119,221,0.4)" }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-mono text-[10px] font-bold tracking-widest"
                      style={{ color: "#AFA9EC" }}
                    >
                      DISTRICT 0{chapter.number} · CLEARED
                    </span>
                    <CheckCircle className="w-4 h-4" style={{ color: "#5DCAA5" }} />
                  </div>
                  {/* NPC chip */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                      style={{ background: `${npcColor}22`, color: npcColor, border: `1px solid ${npcColor}40` }}
                    >
                      {npc[0]}
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: npcColor }}>
                      {npc}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-2 text-white">
                    {chapter.title}
                  </h3>
                  <p className="text-xs leading-relaxed flex-1 mb-5 line-clamp-3" style={{ color: "#6B6A72" }}>
                    {chapter.lore}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "#AFA9EC" }}>
                    <CheckCircle className="w-3 h-3" /> MISSION COMPLETE — REPLAY
                  </div>
                </div>
              </Link>
            ) : chapter.status === "CURRENT" ? (
              /* ── Current / active ── */
              <Link href={`/dashboard/chapter/${chapter.id}`} className="block h-full">
                <div className="h-full flex flex-col p-5 rounded-2xl relative overflow-hidden card-lift circuit-border glass-active">
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, #7F77DD, transparent)" }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-mono text-[10px] font-bold tracking-widest"
                      style={{ color: "#7F77DD" }}
                    >
                      DISTRICT 0{chapter.number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold" style={{ color: "#5DCAA5" }}>
                        ACTIVE
                      </span>
                      <span
                        className="w-2 h-2 rounded-full active-dot"
                        style={{ background: "#5DCAA5" }}
                      />
                    </div>
                  </div>

                  {/* NPC chip */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                      style={{ background: `${npcColor}22`, color: npcColor, border: `1px solid ${npcColor}40` }}
                    >
                      {npc[0]}
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: npcColor }}>
                      {npc} — your fixer
                    </span>
                  </div>

                  <h3 className="text-xl font-black tracking-tight mb-2 text-white">
                    {chapter.title}
                  </h3>
                  <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: "#9998A3" }}>
                    {chapter.lore}
                  </p>

                  <div
                    className="flex items-center justify-between py-2 px-3 rounded"
                    style={{ background: "rgba(127,119,221,0.1)", border: "1px solid rgba(127,119,221,0.2)" }}
                  >
                    <span className="font-mono text-xs font-bold" style={{ color: "#7F77DD" }}>
                      ENTER DISTRICT
                    </span>
                    <Play className="w-3.5 h-3.5" style={{ color: "#7F77DD" }} fill="currentColor" />
                  </div>
                </div>
              </Link>
            ) : (
              /* ── Locked ── */
              <div className="h-full flex flex-col p-5 rounded-2xl relative overflow-hidden glass-panel opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: "#333" }}
                  >
                    DISTRICT 0{chapter.number} · LOCKED
                  </span>
                  <Lock className="w-4 h-4" style={{ color: "#333" }} />
                </div>
                <h3 className="text-lg font-black tracking-tight mb-2" style={{ color: "#333" }}>
                  {chapter.title}
                </h3>
                <p className="text-xs leading-relaxed flex-1 mb-5 line-clamp-3" style={{ color: "#2A2A35" }}>
                  {chapter.lore}
                </p>
                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: "#1A1A22" }}
                >
                  <span className="font-mono text-[10px]" style={{ color: "#333" }}>UNLOCK AT</span>
                  <span className="font-mono text-xs font-bold" style={{ color: "#444" }}>
                    {chapter.unlockXp} XP
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
