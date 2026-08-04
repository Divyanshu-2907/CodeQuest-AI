"use client";

import React from 'react';
import { GitBranch, Radio, Terminal, Code2 } from 'lucide-react';

export default function StatusBar({ chapterTitle, missionTitle }: { chapterTitle: string, missionTitle: string }) {
  return (
    <div className="h-6 w-full bg-[#0A0A0E] border-t border-white/5 flex items-center justify-between px-3 fixed bottom-0 left-0 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
      {/* Left side */}
      <div className="flex items-center gap-4 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors bg-white/5 px-2 py-0.5 rounded-sm">
          <GitBranch size={10} /> master*
        </div>
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
          <Terminal size={10} /> Neural OS v3.0
        </div>
        <div className="hidden md:flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors text-[#7F77DD]">
          <Radio size={10} className="animate-pulse" /> AI Online
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
        <div className="hidden md:block">
          {chapterTitle} <span className="opacity-50">//</span> {missionTitle}
        </div>
        <div className="flex items-center gap-1.5 bg-[#7F77DD]/10 text-[#7F77DD] px-2 py-0.5 rounded-sm cursor-pointer hover:bg-[#7F77DD]/20 transition-colors">
          <Code2 size={10} /> Python 3.12
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">UTF-8</div>
        <div className="hover:text-white cursor-pointer transition-colors">Spaces: 4</div>
      </div>
    </div>
  );
}
