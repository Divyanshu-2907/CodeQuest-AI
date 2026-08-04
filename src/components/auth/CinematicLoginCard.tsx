"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Lock, Fingerprint, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function CinematicLoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [stage, setStage] = useState<"IDLE" | "AUTHENTICATING" | "DECRYPTING" | "SUCCESS">("IDLE");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Neural signature incomplete. Provide email and password.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    setStage("AUTHENTICATING");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setTimeout(() => {
          setErrorMsg(authError.message || "Firewall blocked access. Credentials invalid.");
          setStage("IDLE");
          setLoading(false);
        }, 1500); // Cinematic delay
      } else {
        setStage("DECRYPTING");
        setTimeout(() => {
          setStage("SUCCESS");
          setTimeout(() => {
            router.push("/dashboard/city");
            router.refresh();
          }, 1500); // Wait for success flash
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("An unexpected interface anomaly occurred.");
      setStage("IDLE");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setStage("AUTHENTICATING");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/city",
      });
    } catch (err) {
      setErrorMsg("Google authentication handshake failed.");
      setStage("IDLE");
      setLoading(false);
    }
  };

  if (stage === "SUCCESS") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md flex flex-col items-center justify-center p-12 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ type: "spring", duration: 1 }}
          className="w-24 h-24 rounded-full bg-[#5DCAA5]/20 border-2 border-[#5DCAA5] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(93,202,165,0.4)]"
        >
          <Fingerprint className="w-12 h-12 text-[#5DCAA5]" />
        </motion.div>
        <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          ACCESS GRANTED
        </h2>
        <p className="text-[#5DCAA5] font-mono text-sm tracking-widest uppercase">
          Welcome back to Neural City, Agent.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-30">
      
      {/* Glow Effects */}
      <div className="absolute -inset-0.5 bg-gradient-to-b from-[#7F77DD]/50 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      
      <div className="bg-[rgba(10,10,14,0.85)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Neon Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#7F77DD]/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#7F77DD]/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#7F77DD]/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#7F77DD]/40 rounded-br-xl" />

        {/* Header with New Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="mb-2 relative"
          >
            {/* Logo Glow Behind */}
            <div className="absolute inset-0 bg-[#7F77DD]/20 blur-xl rounded-full" />
            <Image 
              src="/logo.png" 
              alt="CodeQuest AI Logo" 
              width={160} 
              height={160} 
              className="relative z-10 object-contain drop-shadow-[0_0_20px_rgba(127,119,221,0.6)]"
              priority
            />
          </motion.div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-widest text-[#7F77DD] uppercase">SECURE_GATEWAY_v3.0</span>
            <span className="text-[8px] font-mono tracking-widest text-[#5DCAA5] uppercase flex items-center gap-1">
              <Lock size={8} /> MILITARY ENCRYPTION ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white/90 uppercase mt-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            ACCESS THE <span className="text-[#7F77DD]">GRID</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-mono mt-2 tracking-widest uppercase leading-relaxed max-w-[280px]">
            Authenticate your neural identity to establish a secure uplink.
          </p>
        </div>

        {/* Ghost Error Reaction */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-3 h-3 text-red-400" />
              </div>
              <div>
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1 block">ACCESS DENIED</span>
                <span className="text-[11px] font-mono text-gray-300">"Neural signature invalid. {errorMsg}" - <span className="text-[#7F77DD]">GHOST</span></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailSignIn} className="space-y-5 relative z-10">
          
          <div className="relative group">
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full bg-black/40 border border-white/10 rounded-lg px-4 pt-5 pb-2 text-sm text-white focus:outline-none focus:border-[#7F77DD]/50 focus:bg-[#7F77DD]/5 transition-all duration-300 peer font-mono"
              disabled={loading}
            />
            <label className="absolute text-[10px] text-gray-500 font-mono uppercase tracking-widest duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#7F77DD]">
              Agent ID (Email)
            </label>
          </div>

          <div className="relative group">
            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full bg-black/40 border border-white/10 rounded-lg px-4 pt-5 pb-2 text-sm text-white focus:outline-none focus:border-[#7F77DD]/50 focus:bg-[#7F77DD]/5 transition-all duration-300 peer font-mono tracking-widest"
              disabled={loading}
            />
            <label className="absolute text-[10px] text-gray-500 font-mono uppercase tracking-widest duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#7F77DD]">
              Security Key (Password)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative py-4 mt-2 bg-[#7F77DD] hover:bg-[#6c65bd] text-white font-black rounded-lg text-xs tracking-widest uppercase transition-all duration-300 overflow-hidden group cursor-none disabled:opacity-80"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-[length:10px_10px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              {stage === "IDLE" && <><Terminal size={14} /> INITIATE UPLINK</>}
              {stage === "AUTHENTICATING" && <><Loader2 size={14} className="animate-spin" /> AUTHENTICATING...</>}
              {stage === "DECRYPTING" && <><Lock size={14} className="animate-pulse text-[#5DCAA5]" /> DECRYPTING CREDENTIALS...</>}
            </span>
          </button>
        </form>

        <div className="relative my-6 text-center z-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <span className="relative bg-[#0E0E12] px-3 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
            Encrypted OAuth
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="relative z-10 w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold rounded-lg text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-none disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center relative z-10">
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            New to the network?{" "}
            <Link href="/signup" className="text-[#5DCAA5] hover:text-white font-bold transition-colors">
              Initialize Agent
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
