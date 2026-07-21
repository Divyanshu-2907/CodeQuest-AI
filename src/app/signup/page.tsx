"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Terminal, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Name, email and password key are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message || "Failed to register new node link.");
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected registration interface anomaly occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding",
      });
    } catch (err) {
      setError("Google authentication handshake failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080809] text-white relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Grid and Glowing Orbs */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 relative z-10">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A22] pb-5 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40">
              CQ
            </div>
            <span className="text-sm font-black tracking-wider text-[var(--color-primary)]">
              REGISTER_GATEWAY_v1.2
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[9px] text-green-500 uppercase tracking-widest">
              NEW_NODE
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight uppercase">
            CREATE <span className="text-[var(--color-primary)]">RECORD</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Register your identity parameters with Neural City.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-mono flex items-start gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Agent Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[rgba(20,20,24,0.6)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[rgba(127,119,221,0.5)] focus:shadow-[0_0_15px_rgba(127,119,221,0.2)] transition-all font-mono backdrop-blur-md"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Agent Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="agent@neural.city"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[rgba(20,20,24,0.6)] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[rgba(127,119,221,0.5)] focus:shadow-[0_0_15px_rgba(127,119,221,0.2)] transition-all font-mono backdrop-blur-md"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Security Key (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[rgba(20,20,24,0.6)] border border-[rgba(255,255,255,0.05)] rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[rgba(127,119,221,0.5)] focus:shadow-[0_0_15px_rgba(127,119,221,0.2)] transition-all font-mono backdrop-blur-md"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded-lg text-sm tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(127,119,221,0.2)] hover:shadow-[0_0_25px_rgba(127,119,221,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                CREATING NODE...
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                CREATE SYSTEM PROFILE
              </>
            )}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1A1A22]" />
          </div>
          <span className="relative bg-[#0A0A0D] px-3 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
            Social Handshake
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 glass-panel hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 !shadow-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google Connection
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 font-mono">
            Already have a system profile?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] hover:underline font-bold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
