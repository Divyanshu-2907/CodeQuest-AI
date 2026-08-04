"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE = [
  "Initializing NeuralOS v3.0...",
  "Loading Security Modules...",
  "Bypassing Corporate Firewalls...",
  "Synchronizing Atlas Node...",
  "Ghost AI Online...",
  "Neural Core Connected...",
  "Gateway Ready."
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < SEQUENCE.length) {
        setLines(prev => [...prev, SEQUENCE[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 800); // Wait for fade out
        }, 1000);
      }
    }, 400); // 400ms per line

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* Subtle central pulse */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7F77DD] rounded-full blur-[150px] opacity-10 pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="w-full max-w-2xl px-8 flex flex-col items-start font-mono text-sm tracking-widest text-[#5DCAA5]">
            {lines.map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-2 flex items-center gap-3"
              >
                <span className="text-gray-500 text-xs">[{new Date().toISOString().substring(11, 23)}]</span>
                <span>{line}</span>
              </motion.div>
            ))}
            
            {/* Blinking Cursor */}
            {lines.length < SEQUENCE.length && (
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-3 h-4 bg-[#5DCAA5] mt-1 ml-24"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
