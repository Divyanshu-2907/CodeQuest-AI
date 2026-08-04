"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "Initializing Neural Interface...",
  "████████████████ 100%",
  "Authenticating Agent...",
  "Synchronizing Memory...",
  "Quantum Relay Connected",
  "Loading Neural City...",
  "Decrypting Interface...",
  "Launching NeuralOS...",
  "Access Granted"
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Determine how long to wait between each log line to finish in ~2.5 seconds total
    const intervalTime = 2500 / BOOT_LOGS.length;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooted(true);
          setTimeout(onComplete, 500); // Small delay after fade out begins
        }, 400); // Hang on "Access Granted" for a moment
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#080809] flex flex-col justify-end p-8 font-mono text-[11px] text-[#7F77DD]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="max-w-2xl w-full">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-1"
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.div
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, times: [0, 0.5, 0.5, 1] }}
              className="mt-1 w-2 h-4 bg-[#7F77DD]"
            />
          </div>
          
          <button 
            onClick={() => { setBooted(true); setTimeout(onComplete, 500); }}
            className="absolute top-8 right-8 text-[#6B6A72] hover:text-white uppercase tracking-widest text-[10px]"
          >
            [ Skip Sequence ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
