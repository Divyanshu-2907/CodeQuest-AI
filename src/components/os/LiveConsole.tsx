"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, CheckCircle, Wifi } from 'lucide-react';

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'GHOST' | 'NETWORK' | 'SYSTEM';

export interface ConsoleMessage {
  id: string;
  level: LogLevel;
  text: string;
  timestamp: string;
}

interface LiveConsoleProps {
  logs: ConsoleMessage[];
}

export default function LiveConsole({ logs }: LiveConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  const getColor = (level: LogLevel) => {
    switch(level) {
      case 'SUCCESS': return 'text-[#5DCAA5]';
      case 'ERROR': return 'text-red-400';
      case 'WARNING': return 'text-amber-400';
      case 'GHOST': return 'text-[#7F77DD]';
      case 'NETWORK': return 'text-cyan-400';
      case 'SYSTEM': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getIcon = (level: LogLevel) => {
    switch(level) {
      case 'SUCCESS': return <CheckCircle size={10} className="mr-1" />;
      case 'ERROR': return <ShieldAlert size={10} className="mr-1" />;
      case 'WARNING': return <ShieldAlert size={10} className="mr-1" />;
      case 'GHOST': return <Terminal size={10} className="mr-1" />;
      case 'NETWORK': return <Wifi size={10} className="mr-1" />;
      case 'SYSTEM': return <Terminal size={10} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative font-mono text-[11px] leading-relaxed">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-3 ${getColor(log.level)}`}
            >
              <div className="opacity-50 shrink-0 text-gray-500">
                [{log.timestamp}]
              </div>
              <div className="flex items-start">
                <span className="shrink-0 mt-0.5">{getIcon(log.level)}</span>
                <span className="font-bold opacity-80 mr-2 shrink-0">
                  [{log.level}]
                </span>
                <span className="whitespace-pre-wrap">{log.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Blinking Cursor */}
        <motion.div 
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-2 h-3 bg-gray-400 mt-2 ml-1"
        />
      </div>
    </div>
  );
}
