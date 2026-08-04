"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKernel, useOSEvent } from '../kernel/KernelProvider';
import { X } from 'lucide-react';

interface OSWindow {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultPosition?: { x: number, y: number };
}

export default function WindowManager() {
  const { state, closeWindow, focusWindow } = useKernel();
  const [windows, setWindows] = useState<Map<string, OSWindow>>(new Map());

  useOSEvent("WINDOW_OPEN", (payload) => {
    setWindows(prev => {
      const next = new Map(prev);
      next.set(payload.id, {
        id: payload.id,
        title: payload.title || "TERMINAL",
        content: payload.content || <div className="p-4 text-gray-500">Empty Buffer</div>,
        defaultPosition: payload.defaultPosition || { x: (typeof window !== 'undefined' ? window.innerWidth / 2 : 500) - 200, y: (typeof window !== 'undefined' ? window.innerHeight / 2 : 300) - 150 }
      });
      return next;
    });
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {state.activeWindows.map(id => {
          const win = windows.get(id);
          if (!win) return null;
          
          const isFocused = state.focusedWindow === id;

          return (
            <motion.div
              key={id}
              drag
              dragMomentum={false}
              onMouseDown={() => focusWindow(id)}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              style={{
                zIndex: isFocused ? 50 : 10,
                x: win.defaultPosition?.x,
                y: win.defaultPosition?.y,
              }}
              className={`absolute pointer-events-auto rounded-lg overflow-hidden border backdrop-blur-xl shadow-2xl flex flex-col w-[400px] h-[300px]
                ${isFocused ? 'border-[#7F77DD]/40 bg-[#0A0A0E]/90' : 'border-[#1C1C21]/60 bg-[#0A0A0E]/60'}
              `}
            >
              {/* Window Header */}
              <div className={`h-8 flex items-center px-3 border-b cursor-grab active:cursor-grabbing shrink-0
                ${isFocused ? 'border-[#7F77DD]/20 bg-[#7F77DD]/5' : 'border-[#1C1C21]/60 bg-white/5'}
              `}>
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#8C8C9A]">
                  {win.title}
                </span>
                <button 
                  onClick={() => closeWindow(id)}
                  className="ml-auto opacity-50 hover:opacity-100 text-[#8C8C9A] hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
              
              {/* Window Content */}
              <div className="flex-1 overflow-auto custom-scrollbar p-0 bg-[#0A0A0E]">
                {win.content}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
