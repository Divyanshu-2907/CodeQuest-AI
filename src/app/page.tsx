import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Terminal, Shield, Cpu, MessageSquare, Star, Check, Zap } from "lucide-react";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  const testimonials = [
    {
      handle: "null_pointer",
      quote: "Bypassing firewalls in NumPy felt like a real hack. The AI feedback on my algorithms is top-notch.",
      level: 14,
    },
    {
      handle: "byte_me",
      quote: "The live NPC interaction is wild. When Ghost yelled at me for my syntax error, I learned it instantly.",
      level: 9,
    },
    {
      handle: "cyber_samurai",
      quote: "Upgrading to Pro was a no-brainer. The agent ReAct loop missions in Chapter 4 are worth every rupee.",
      level: 18,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-white relative overflow-hidden">
      {/* Dynamic Background Grid and Ambient Glows */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.15] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 w-[1000px] h-[500px] bg-[var(--color-primary)]/20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:px-12 max-w-7xl mx-auto w-full border-b border-[#2A2A35]/30">
        <h1 className="text-2xl font-black tracking-tighter text-[var(--color-primary)] drop-shadow-[0_0_10px_rgba(127,119,221,0.5)]">
          CODEQUEST_
        </h1>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Grid Features</a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Clearance Tiers</a>
          {!userId ? (
            <Link href="/login" className="text-sm font-bold glass-panel hover:glass-active text-[#AFA9EC] px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer">
              Agent Login
            </Link>
          ) : (
            <Link href="/dashboard/city" className="text-sm font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white px-4 py-2 rounded-lg transition-colors">
              Access Terminal
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center py-20 px-6 text-center max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-active text-xs font-black tracking-widest text-[#AFA9EC] uppercase">
            <Terminal className="w-3.5 h-3.5 text-[#7F77DD]" /> SECURE UPLINK INITIATED
          </div>
          <h1 className="flex flex-col items-center gap-2 md:gap-4 mb-2">
            <span className="text-3xl md:text-5xl font-bold tracking-tight text-white/90 font-sans">
              Master Python.
            </span>
            <span 
              className="city-heading-glitch text-5xl md:text-7xl lg:text-8xl drop-shadow-[0_0_30px_rgba(127,119,221,0.5)]" 
              data-text="HACK THE CITY."
            >
              HACK THE CITY.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in a narrative-driven cyberpunk sandbox. Solve real programming challenges, build machine learning pipelines, execute vector store operations, and bypass AI mainframes.
          </p>
          
          <div className="pt-6">
            {!userId ? (
              <Link href="/signup" className="inline-block glass-panel hover:glass-active text-[#EEEDFE] font-black py-4 px-10 rounded-xl text-lg tracking-wide uppercase transition-all duration-500 transform hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(127,119,221,0.2)] to-[rgba(127,119,221,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2 text-shadow-sm">INITIATE SYSTEM UPLINK <Zap className="w-5 h-5 text-[#7F77DD]" /></span>
              </Link>
            ) : (
              <Link href="/dashboard/city" className="inline-block glass-active hover:bg-[rgba(127,119,221,0.2)] text-white font-black py-4 px-10 rounded-xl text-lg tracking-wide uppercase transition-all duration-300 transform hover:scale-105">
                ENTER DASHBOARD
              </Link>
            )}
          </div>
        </div>

        {/* Feature Cards Section */}
        <section id="features" className="w-full pt-32 pb-20 text-left">
          <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase mb-4 text-center">SYSTEM OVERVIEW</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white text-center uppercase tracking-tight mb-16">Platform Core Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 relative overflow-hidden group hover:glass-active transition-all duration-500">
              <div className="p-3 bg-[rgba(127,119,221,0.1)] text-[#7F77DD] rounded-xl w-fit mb-6 border border-[rgba(127,119,221,0.2)]">
                <Terminal className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold tracking-tight text-white mb-2">Isolated Sandbox Compiler</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Run real Python algorithms in secure, dedicated sandboxes with zero setup. We support NumPy, Pandas, Scikit-learn, and vector stores.
              </p>
            </div>

            <div className="glass-panel p-8 relative overflow-hidden group hover:glass-active transition-all duration-500">
              <div className="p-3 bg-[rgba(127,119,221,0.1)] text-[#7F77DD] rounded-xl w-fit mb-6 border border-[rgba(127,119,221,0.2)]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold tracking-tight text-white mb-2">Dynamic Story Engine</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Interact with cyberpunk fixers like Ghost and Vex in real-time. NPCs track your code compilations, success, failure logs, and offer hints.
              </p>
            </div>

            <div className="glass-panel p-8 relative overflow-hidden group hover:glass-active transition-all duration-500">
              <div className="p-3 bg-[rgba(127,119,221,0.1)] text-[#7F77DD] rounded-xl w-fit mb-6 border border-[rgba(127,119,221,0.2)]">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold tracking-tight text-white mb-2">Progression Framework</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Unlock achievements and claim unique prestige badges (First Blood, Speed Demon, Neural Architect). Compete globally on the live leaderboard.
              </p>
            </div>

            <div className="glass-panel p-8 relative overflow-hidden group hover:glass-active transition-all duration-500">
              <div className="p-3 bg-[rgba(127,119,221,0.1)] text-[#7F77DD] rounded-xl w-fit mb-6 border border-[rgba(127,119,221,0.2)]">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold tracking-tight text-white mb-2">Pro Hacking Mentorship</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Unlock advanced chapter models, get exclusive mentor feedback hints from our AI model evaluator, and gain unlimited compiler executions.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-20">
          <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase mb-4 text-center">AGENT FEEDBACK</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white text-center uppercase tracking-tight mb-16">Uplink Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {testimonials.map((t) => (
              <div key={t.handle} className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:bg-[rgba(127,119,221,0.05)] transition-colors">
                <p className="text-sm text-gray-300 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-4">
                  <span className="font-mono text-xs text-[#7F77DD]">@{t.handle}</span>
                  <span className="text-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-2 py-0.5 rounded font-bold uppercase">LVL {t.level}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Clearance Tiers */}
        <section id="pricing" className="w-full py-20">
          <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase mb-4 text-center">SYSTEM ACCESS TIER</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white text-center uppercase tracking-tight mb-16">Choose Clearance Tier</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left items-stretch">
            {/* Free Tier */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">BASIC CLEARANCE</h4>
                <h3 className="text-3xl font-black text-white uppercase mb-4">Grid Rookie</h3>
                <p className="text-3xl font-black text-white mb-6">₹0 <span className="text-xs text-gray-500 font-normal">/ forever</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start text-sm text-gray-400 gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Access to Chapter 1-3 core missions
                  </li>
                  <li className="flex items-start text-sm text-gray-400 gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Live terminal python compiler
                  </li>
                  <li className="flex items-start text-sm text-gray-400 gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 3 sandbox runs per mission / day
                  </li>
                  <li className="flex items-start text-sm text-gray-600 line-through gap-2">
                    Boss levels and Chapter 4/5 access
                  </li>
                  <li className="flex items-start text-sm text-gray-600 line-through gap-2">
                    AI Mentor Mode hints
                  </li>
                </ul>
              </div>
              {!userId ? (
                <Link href="/signup" className="w-full text-center py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer">
                  JOIN FREE GRID
                </Link>
              ) : (
                <Link href="/dashboard/city" className="w-full text-center py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white font-bold rounded-xl text-sm transition-colors">
                  OPEN TERMINAL
                </Link>
              )}
            </div>

            {/* Pro Tier */}
            <div className="glass-active p-8 rounded-2xl flex flex-col justify-between relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#7F77DD] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(127,119,221,0.5)]">
                <Star className="w-3 h-3 fill-white" /> RECOMMENDED
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2">ULTIMATE CLEARANCE</h4>
                <h3 className="text-3xl font-black text-white uppercase mb-4 font-black">Neural Pro</h3>
                <p className="text-3xl font-black text-white mb-6">₹499 <span className="text-xs text-gray-500 font-normal">/ month</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start text-sm text-white gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" /> Unlock Chapters 4 & 5
                  </li>
                  <li className="flex items-start text-sm text-white gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" /> All Elite Boss missions open
                  </li>
                  <li className="flex items-start text-sm text-white gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" /> Unlimited compiler execution speed
                  </li>
                  <li className="flex items-start text-sm text-white gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" /> AI Mentor Mode (exclusive hints)
                  </li>
                  <li className="flex items-start text-sm text-white gap-2">
                    <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" /> "Inner Circle" Golden Profile Badge
                  </li>
                </ul>
              </div>
              {!userId ? (
                <Link href="/signup" className="w-full text-center py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)] cursor-pointer">
                  UPGRADE NOW
                </Link>
              ) : (
                <Link href="/dashboard/upgrade" className="w-full text-center py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(127,119,221,0.3)]">
                  ACQUIRE CLEARANCE
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2A2A35]/30 p-8 text-center text-[var(--color-muted)] text-sm max-w-7xl mx-auto w-full">
        &copy; {new Date().getFullYear()} CODEQUEST AI. NETWORK PROTECTED. ALL SYTEMS FUNCTIONAL.
      </footer>
    </div>
  );
}
