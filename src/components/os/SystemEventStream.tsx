"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EVENTS = [
  "[GHOST] Deep network scan completed.",
  "[ATLAS] Model weights synchronized.",
  "[SYSTEM] Vector database indexed: 420 nodes.",
  "[NETWORK] Firewall patch v2.4 applied.",
  "[COMPILER] Neural engine ready.",
  "[GHOST] I found a vulnerability in Sector 4.",
  "[SYSTEM] Mission cache cleared.",
  "[ATLAS] Evaluating agent performance matrix.",
  "[NETWORK] Subspace relay ping: 12ms."
];

interface StreamEvent {
  id: string;
  text: string;
}

export default function SystemEventStream() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial boot events
    setEvents([
      { id: '1', text: "[SYSTEM] OS Boot sequence initiated." },
      { id: '2', text: "[NETWORK] Establishing secure uplinks..." }
    ]);

    const timer = setInterval(() => {
      const newEvent = {
        id: Math.random().toString(36).substring(7),
        text: EVENTS[Math.floor(Math.random() * EVENTS.length)]
      };
      
      setEvents(prev => [...prev, newEvent].slice(-8)); // Keep last 8
      
      // Auto scroll
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);

    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-6 left-6 w-80 h-40 pointer-events-none z-20 flex flex-col justify-end">
      <div 
        ref={containerRef}
        className="flex flex-col gap-1 overflow-hidden"
      >
        <AnimatePresence initial={false}>
          {events.map((ev, idx) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
              animate={{ opacity: idx === events.length - 1 ? 1 : 0.5, x: 0, filter: "blur(0px)" }}
              className="text-[10px] font-mono tracking-widest text-gray-400"
            >
              {ev.text.includes("[GHOST]") && <span className="text-[#7F77DD] font-bold mr-2">[GHOST]</span>}
              {ev.text.includes("[ATLAS]") && <span className="text-[#5DCAA5] font-bold mr-2">[ATLAS]</span>}
              {ev.text.includes("[SYSTEM]") && <span className="text-white opacity-50 mr-2">[SYS]</span>}
              {ev.text.includes("[NETWORK]") && <span className="text-cyan-400 opacity-50 mr-2">[NET]</span>}
              {ev.text.replace(/\[.*?\] /, '')}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
