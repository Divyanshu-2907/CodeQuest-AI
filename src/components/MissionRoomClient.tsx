"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Play, Check, Terminal, Shield, Trophy, Lock } from "lucide-react";
import Link from "next/link";
import NpcChat, { NpcChatRef } from "./NpcChat";

type MissionWithDetails = any; // You can refine this type based on your Prisma generated types

export default function MissionRoomClient({ mission, userMissionStatus, isPro }: { mission: MissionWithDetails, userMissionStatus: string, isPro: boolean }) {
  const [code, setCode] = useState(mission.starterCode || "");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [runsRemaining, setRunsRemaining] = useState<number>(3);
  const [isJudging, setIsJudging] = useState(false);
  const [judgeFeedback, setJudgeFeedback] = useState<any>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [status, setStatus] = useState(userMissionStatus);
  const [attemptCount, setAttemptCount] = useState(0);

  const chatRef = useRef<NpcChatRef>(null);
  const hasTriggeredIntro = useRef(false);

  useEffect(() => {
    if (!hasTriggeredIntro.current) {
      hasTriggeredIntro.current = true;
      setTimeout(() => chatRef.current?.triggerMessage("A"), 1000);

      // Track mission_started in PostHog
      if (typeof window !== "undefined" && (window as any).posthog) {
        (window as any).posthog.capture("mission_started", {
          missionId: mission.id,
          chapterId: mission.chapterId,
          status: status
        });
      }
    }
  }, [mission.id, mission.chapterId, status]);

  useEffect(() => {
    if (!isPro) {
      fetch("/api/execute/runs-remaining")
        .then(res => res.json())
        .then(data => setRunsRemaining(data.runsRemaining))
        .catch(console.error);
    }
  }, [isPro]);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("Executing sequence in E2B Sandbox...\n");
    setJudgeFeedback(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, missionId: mission.id })
      });
      const data = await res.json();
      if (data.runsRemaining !== undefined) {
        setRunsRemaining(data.runsRemaining);
      }
      if (data.error) {
        setOutput(`[SYSTEM ERROR]: ${data.error}`);
        if (!data.limitExceeded) {
          const newCount = attemptCount + 1;
          setAttemptCount(newCount);
          chatRef.current?.triggerMessage(newCount >= 3 ? "D" : "C", data.error, newCount);
        }
      } else {
        const outStr = data.stdout + (data.stderr ? `\n[STDERR]: ${data.stderr}` : "");
        setOutput(outStr);
        if (data.stderr) {
          const newCount = attemptCount + 1;
          setAttemptCount(newCount);
          chatRef.current?.triggerMessage(newCount >= 3 ? "D" : "C", outStr, newCount);
        } else {
          chatRef.current?.triggerMessage("B", outStr);
        }
      }
    } catch (err) {
      setOutput("[FATAL ERROR]: Connection to sandbox lost.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!output && !code) {
      setOutput("[SYSTEM]: You must write and run the code before submitting for evaluation.");
      return;
    }
    
    setIsJudging(true);
    setJudgeFeedback(null);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, output, missionId: mission.id })
      });
      const data = await res.json();
      setJudgeFeedback(data);
      
      if (data.passed) {
        setStatus("COMPLETED");
        chatRef.current?.triggerMessage("E");

        // PostHog mission_completed event
        if (typeof window !== "undefined" && (window as any).posthog) {
          (window as any).posthog.capture("mission_completed", {
            missionId: mission.id,
            chapterId: mission.chapterId,
            score: data.score
          });
        }

        if (data.levelUp) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 4000);

          // PostHog level_up event
          if (typeof window !== "undefined" && (window as any).posthog) {
            (window as any).posthog.capture("level_up", {
              missionId: mission.id,
              chapterId: mission.chapterId
            });
          }
        }

        // PostHog badge_earned events
        if (data.badgesEarned && Array.isArray(data.badgesEarned)) {
          data.badgesEarned.forEach((badgeName: string) => {
            if (typeof window !== "undefined" && (window as any).posthog) {
              (window as any).posthog.capture("badge_earned", {
                badgeName,
                missionId: mission.id,
                chapterId: mission.chapterId
              });
            }
          });
        }
      } else {
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        chatRef.current?.triggerMessage(newCount >= 3 ? "D" : "C", output, newCount);

        // PostHog mission_failed event
        if (typeof window !== "undefined" && (window as any).posthog) {
          (window as any).posthog.capture("mission_failed", {
            missionId: mission.id,
            chapterId: mission.chapterId,
            score: data.score,
            attempt: newCount
          });
        }
      }
    } catch (err) {
      setJudgeFeedback({ error: "Judge connection failed." });
    } finally {
      setIsJudging(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full p-4 gap-4 bg-[var(--color-background)] relative">
      
      {/* Pro Lock Overlay for Boss Missions */}
      {mission.type === "BOSS" && !isPro && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="text-center p-8 bg-[var(--color-surface)] border border-yellow-500/30 rounded-2xl max-w-md shadow-[0_0_50px_rgba(234,179,8,0.2)]">
            <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">PRO BOSS ENCOUNTER</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Security sector bosses represent high computational threats. Upgrade to Pro clearance to engage this node.
            </p>
            <Link 
              href="/dashboard/upgrade" 
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).posthog) {
                  (window as any).posthog.capture("upgrade_clicked", {
                    source: "boss_lock_overlay",
                    missionId: mission.id
                  });
                }
              }}
              className="inline-block py-3 px-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded transition-colors shadow-lg"
            >
              GO PRO TO UNLOCK
            </Link>
          </div>
        </div>
      )}
      
      <NpcChat 
        ref={chatRef} 
        missionId={mission.id} 
        npcName={mission.chapter?.npcName || "System"} 
      />

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="text-center p-12 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent border border-[var(--color-primary)] rounded-3xl shadow-[0_0_100px_rgba(127,119,221,0.5)]">
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">LEVEL UP</h2>
              <p className="text-xl md:text-2xl text-[var(--color-primary)] font-bold">Neural capacity expanded.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL A: Briefing (30%) */}
      <div className="w-full md:w-[30%] glass-panel flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-800 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
              {mission.chapter?.title.substring(0, 2).toUpperCase() || 'NX'}
            </div>
            <div>
              <div className="font-bold text-white text-sm">Sector Fixer</div>
              <div className="text-xs text-[var(--color-muted)]">Encrypted Comm Link</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-[var(--color-muted)] font-medium">REWARD</div>
            <div className="text-sm font-bold text-yellow-400 flex items-center">
              <Shield className="w-3 h-3 mr-1" /> {mission.xpReward} XP
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar text-sm text-gray-300 space-y-4">
          <div className="mb-4">
            <div className="heading-tag">// MISSION_BRIEFING</div>
            <h1 className="city-heading text-xl md:text-2xl" data-text={mission.title}>
              {mission.title}
              <span className="heading-badge heading-badge-purple ml-3">{mission.type}</span>
            </h1>
            <div className="mt-2">
              <Link href="/dashboard/city" className="text-xs text-[var(--color-primary)] hover:underline font-mono">
                &lt; Return to City
              </Link>
            </div>
          </div>
          <div className="p-4 bg-black/30 border-l-2 border-[var(--color-primary)] rounded-r-lg font-mono leading-relaxed text-[#00ffcc] text-sm">
            {mission.briefing}
          </div>
          {status === "COMPLETED" && (
            <div className="mt-8 p-4 bg-[rgba(93,202,165,0.1)] border border-[rgba(93,202,165,0.2)] rounded-lg flex items-center text-[#5DCAA5] font-medium shadow-[0_0_15px_rgba(93,202,165,0.1)]">
              <Check className="w-5 h-5 mr-3" /> Mission Accomplished
            </div>
          )}
        </div>
      </div>

      {/* PANEL B: Code Editor (45%) */}
      <div className="w-full md:w-[45%] glass-panel !p-0 flex flex-col overflow-hidden shadow-2xl relative">
        <div className="h-10 bg-[rgba(20,20,24,0.6)] border-b border-[rgba(255,255,255,0.05)] flex items-center px-4 backdrop-blur-md">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="mx-auto text-xs font-mono text-gray-400 tracking-widest">main.py</div>
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
              fontFamily: "var(--font-inter)",
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="p-4 bg-[rgba(20,20,24,0.6)] border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center backdrop-blur-md">
          <span className="text-xs text-gray-500 font-mono">Python 3.10 Runtime via E2B</span>
          <button 
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-medium rounded transition-colors disabled:opacity-50"
          >
            {isExecuting ? <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4 mr-2" fill="currentColor" />}
            RUN CODE
          </button>
        </div>
      </div>

      {/* PANEL C: Output Terminal (25%) */}
      <div className="w-full md:w-[25%] glass-panel flex flex-col overflow-hidden">
        <div className="p-3 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between text-xs font-bold text-[var(--color-muted)] tracking-wider">
          <div className="flex items-center">
            <Terminal className="w-4 h-4 mr-2 text-[var(--color-primary)]" />
            SYSTEM CONSOLE
          </div>
          {!isPro && (
            <span className="text-[10px] text-yellow-500 font-mono">
              Runs Remaining: {runsRemaining}/3
            </span>
          )}
        </div>
        
        <div className="flex-1 p-4 font-mono text-xs text-gray-300 overflow-y-auto custom-scrollbar bg-black/40">
          <pre className="whitespace-pre-wrap">{output || "Waiting for execution..."}</pre>
          
          {judgeFeedback && (
            <div className="mt-6 border-t border-[#2A2A35] pt-4">
              <div className="text-[var(--color-primary)] font-bold mb-2 uppercase">&gt;&gt; Judge Analysis:</div>
              {judgeFeedback.error ? (
                <div className="text-red-400">{judgeFeedback.error}</div>
              ) : (
                <>
                  <div className={`font-bold text-lg mb-2 ${judgeFeedback.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {judgeFeedback.passed ? 'MISSION PASSED' : 'MISSION FAILED'}
                  </div>
                  <div className="text-gray-300 italic">"{judgeFeedback.feedback}"</div>
                  <div className="mt-3 text-yellow-400 font-bold">Score: {judgeFeedback.score}/100</div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#2A2A35] bg-[#2A2A35]/30">
          <button 
            onClick={handleSubmit}
            disabled={isJudging || status === "COMPLETED"}
            className="w-full flex items-center justify-center px-5 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-white"
          >
            {isJudging ? "EVALUATING..." : status === "COMPLETED" ? "MISSION COMPLETE" : "SUBMIT FOR GRADING"}
          </button>
        </div>
      </div>

    </div>
  );
}
