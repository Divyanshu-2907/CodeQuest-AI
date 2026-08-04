"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKernel, useOSEvent } from '../kernel/KernelProvider';
import { ShieldAlert, Terminal, Cpu, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "CRITICAL" | "AI";
  timestamp: number;
}

export default function NotificationCenter() {
  const { state } = useKernel();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notif: Omit<Notification, "id" | "timestamp">) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [
      { ...notif, id, timestamp: Date.now() },
      ...prev
    ].slice(0, 5)); // Keep only last 5

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useOSEvent("NEW_TRANSMISSION", (payload) => {
    addNotification({
      title: "SYSTEM TRANSMISSION",
      message: payload?.message || "Incoming transmission",
      type: "INFO"
    });
  });

  useOSEvent("AI_MESSAGE", (payload) => {
    addNotification({
      title: `${payload?.persona} // SECURE CHANNEL`,
      message: payload?.message || "...",
      type: "AI"
    });
  });

  useOSEvent("THREAT_CHANGED", (payload) => {
    addNotification({
      title: "THREAT LEVEL UPDATE",
      message: `Global threat level escalated to ${payload?.level}`,
      type: payload?.level === "CRITICAL" ? "CRITICAL" : "WARNING"
    });
  });

  return (
    <div className="fixed top-24 right-8 z-[100] w-80 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className={`pointer-events-auto backdrop-blur-md border rounded-md p-4 overflow-hidden relative
              ${notif.type === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                notif.type === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                notif.type === 'AI' ? 'bg-[#7F77DD]/10 border-[#7F77DD]/30 text-[#7F77DD]' :
                'bg-white/5 border-white/10 text-gray-300'
              }
            `}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex gap-3 relative z-10">
              <div className="mt-0.5 shrink-0">
                {notif.type === 'CRITICAL' && <ShieldAlert size={14} />}
                {notif.type === 'WARNING' && <ShieldAlert size={14} />}
                {notif.type === 'INFO' && <Terminal size={14} />}
                {notif.type === 'AI' && <MessageSquare size={14} />}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">
                  {notif.title}
                </div>
                <div className="text-xs font-mono leading-relaxed">
                  {notif.message}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
