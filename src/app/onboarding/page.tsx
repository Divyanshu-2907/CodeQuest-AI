"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, ArrowRight, User, Award, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [track, setTrack] = useState<"BEGINNER" | "INTERMEDIATE">("BEGINNER");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // NPC message states
  const [npcMessage, setNpcMessage] = useState("");
  const [npcStreaming, setNpcStreaming] = useState(false);
  const [firstMissionId, setFirstMissionId] = useState("");

  const checkUsername = async (val: string) => {
    if (val.trim().length < 3) {
      setUsernameError("Handle must be at least 3 characters.");
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    setUsernameError("");
    try {
      const res = await fetch("/api/user/validate-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: val })
      });
      const data = await res.json();
      if (data.available) {
        setUsernameAvailable(true);
        setUsernameError("");
      } else {
        setUsernameAvailable(false);
        setUsernameError(data.error || "Handle is already claimed by another agent.");
      }
    } catch (e) {
      setUsernameError("Failed to verify handle connection.");
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleNextStep = () => {
    if (step === 2 && (!usernameAvailable || usernameChecking)) {
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setStep(prev => prev - 1);
  };

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, track })
      });
      const data = await res.json();
      if (data.success) {
        setFirstMissionId(data.firstMissionId);
        // Start Step 4: Stream the welcome message
        setStep(4);
        streamWelcomeMessage(data.firstMissionId);
      } else {
        alert(data.error || "Failed to save onboarding parameters.");
      }
    } catch (err) {
      alert("Onboarding uplink failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const streamWelcomeMessage = async (missionId: string) => {
    if (!missionId) {
      setNpcMessage("Welcome to the grid, Agent. Connect to your system terminal to begin.");
      return;
    }
    setNpcStreaming(true);
    setNpcMessage("");

    try {
      const res = await fetch("/api/npc/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId,
          trigger: "WELCOME",
          messageHistory: []
        })
      });

      if (!res.body) throw new Error("No payload stream returned");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                buffer += data.text;
                setNpcMessage(buffer);
              }
            } catch (e) {
              console.error("SSE decode error", e);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setNpcMessage("Neural guide connection disrupted. Head to the dashboard to sync your node.");
    } finally {
      setNpcStreaming(false);
    }
  };

  const enterCity = () => {
    // PostHog event track
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("onboarding_completed", {
        username,
        starterTrack: track
      });
    }
    router.push("/dashboard/city");
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white relative flex items-center justify-center p-6 overflow-hidden">
      {/* Cyberspace Grid & Accents */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-[var(--color-primary)]/10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-sm border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= s
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(127,119,221,0.5)]"
                  : "border-[#2A2A35] bg-[#1E1E2A]/50 text-gray-500"
              }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`h-[2px] flex-1 mx-2 transition-colors duration-300 ${
                  step > s ? "bg-[var(--color-primary)]" : "bg-[#2A2A35]"
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME TO NEURAL CITY */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="text-[var(--color-primary)] w-8 h-8" />
                <h1 className="text-3xl font-black uppercase tracking-tight">Accessing Grid</h1>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                You have bypassed corporate border nodes. Before we assign your connection credentials, sync your system profile to establish neural alignment.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[rgba(20,20,24,0.3)] border border-[rgba(255,255,255,0.05)] backdrop-blur-sm">
                  <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Real Compilers</h3>
                    <p className="text-xs text-gray-400 mt-1">Compile and execute actual Python code within secure isolated sandboxes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-[rgba(20,20,24,0.3)] border border-[rgba(255,255,255,0.05)] backdrop-blur-sm">
                  <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Interactive Guide</h3>
                    <p className="text-xs text-gray-400 mt-1">Operate alongside cybernetic NPC fixers who react dynamically to your actions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-[rgba(20,20,24,0.3)] border border-[rgba(255,255,255,0.05)] backdrop-blur-sm">
                  <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Progression & Growth</h3>
                    <p className="text-xs text-gray-400 mt-1">Acquire XP, unlock prestige levels, earn achievement badges, and climb leaderboards.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)]"
              >
                ESTABLISH UPLINK <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: PICK HACKER HANDLE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
              <div className="flex items-center gap-3 mb-6">
                <User className="text-[var(--color-primary)] w-8 h-8" />
                <h1 className="text-3xl font-black uppercase tracking-tight">Hacker Handle</h1>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Choose a unique callsign to identify yourself on the public grid and leaderboard logs. Choose wisely — it cannot be reset easily.
              </p>

              <div className="space-y-4 mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter agent handle..."
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "");
                      setUsername(val);
                      setUsernameAvailable(null);
                      setUsernameError("");
                    }}
                    className="w-full bg-[rgba(20,20,24,0.6)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-3 outline-none text-white focus:border-[rgba(127,119,221,0.5)] focus:shadow-[0_0_15px_rgba(127,119,221,0.2)] transition-all backdrop-blur-md"
                  />
                  <button
                    onClick={() => checkUsername(username)}
                    disabled={usernameChecking || !username}
                    className="absolute right-2 top-2 px-3 py-1 bg-[#2A2A35] hover:bg-[#2A2A35]/80 text-xs text-gray-300 font-bold rounded"
                  >
                    {usernameChecking ? "VERIFYING..." : "VERIFY"}
                  </button>
                </div>

                {usernameAvailable === true && (
                  <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" /> HANDLE UNLOCKED & AVAILABLE
                  </div>
                )}
                {usernameError && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" /> {usernameError}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBackStep}
                  className="flex-1 py-4 bg-transparent border border-[#2A2A35] hover:bg-[#2A2A35]/30 text-gray-400 font-bold rounded-lg transition-colors"
                >
                  PREVIOUS
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!usernameAvailable || usernameChecking}
                  className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)]"
                >
                  CONTINUE
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CHOOSE TRACK */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-[var(--color-primary)] w-8 h-8" />
                <h1 className="text-3xl font-black uppercase tracking-tight">Starter Track</h1>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Select your system clearance tier. Beginner tier covers fundamental Python rules, while Intermediate tier fast-tracks you to machine learning models.
              </p>

              <div className="grid grid-cols-1 gap-4 mb-8">
                <div
                  onClick={() => setTrack("BEGINNER")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    track === "BEGINNER"
                      ? "glass-active"
                      : "glass-panel hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white uppercase tracking-wider text-sm">Beginner Node</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-black">START AT CH 1</span>
                  </div>
                  <p className="text-xs text-gray-400">Initialize at 0 XP. Ideal for learners mastering syntax, loops, and basic arrays.</p>
                </div>

                <div
                  onClick={() => setTrack("INTERMEDIATE")}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    track === "INTERMEDIATE"
                      ? "glass-active"
                      : "glass-panel hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white uppercase tracking-wider text-sm">Intermediate Node</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-black">START AT CH 2 (+500 XP)</span>
                  </div>
                  <p className="text-xs text-gray-400">Initialize at 500 XP (Level 2). Skippable basic modules, diving straight into Scikit-learn pipelines.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBackStep}
                  className="flex-1 py-4 bg-transparent border border-[#2A2A35] hover:bg-[#2A2A35]/30 text-gray-400 font-bold rounded-lg transition-colors"
                >
                  PREVIOUS
                </button>
                <button
                  onClick={submitOnboarding}
                  disabled={loading}
                  className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)] disabled:opacity-50"
                >
                  {loading ? "INITIALIZING LINK..." : "FINALIZE UPLINK"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: GHOST WELCOME MESSAGE (SSE) */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-active p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-[var(--color-primary)] flex items-center justify-center font-bold text-sm text-white uppercase shadow-[0_0_15px_rgba(127,119,221,0.4)]">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">GHOST</h3>
                  <p className="text-[10px] text-[var(--color-primary)] font-bold tracking-widest uppercase">Underground Guide</p>
                </div>
              </div>

              <div className="bg-black/50 border border-[#2A2A35] rounded-lg p-6 min-h-[140px] mb-8 font-mono text-sm leading-relaxed text-gray-200">
                {npcMessage}
                {npcStreaming && (
                  <span className="inline-block w-1.5 h-4 bg-[var(--color-primary)] ml-1 animate-pulse" />
                )}
              </div>

              <button
                onClick={enterCity}
                disabled={npcStreaming}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)]"
              >
                ENTER CITY GRID <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
