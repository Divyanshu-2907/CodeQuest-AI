"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { osEventBus, OSEventType, OSEvent } from '../events/EventBus';

interface KernelState {
  threatLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  activeWindows: string[];
  focusedWindow: string | null;
  systemTime: string;
  themeColor: string;
  isBooted: boolean;
}

interface KernelContextType {
  state: KernelState;
  emit: (type: OSEventType, payload?: any) => void;
  // Expose specific fast-path functions if needed
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  openWindow: (id: string, payload?: any) => void;
}

const KernelContext = createContext<KernelContextType | null>(null);

export function KernelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KernelState>({
    threatLevel: "LOW",
    activeWindows: [],
    focusedWindow: null,
    systemTime: "SYNCING...",
    themeColor: "#8B5CF6", // Primary
    isBooted: false,
  });

  useEffect(() => {
    // 1. Mark OS as booted after initial mount (simulates startup)
    const bootTimer = setTimeout(() => {
      setState(s => ({ ...s, isBooted: true }));
      osEventBus.emit("SYSTEM_BOOT");
    }, 1000);

    // 2. Start system clock
    const clockTimer = setInterval(() => {
      setState(s => ({ ...s, systemTime: new Date().toLocaleTimeString() }));
    }, 1000);

    // 3. Register core OS event listeners
    const unsubThreat = osEventBus.subscribe("THREAT_CHANGED", (e) => {
      setState(s => ({ ...s, threatLevel: e.payload?.level || "LOW" }));
    });

    const unsubWindowOpen = osEventBus.subscribe("WINDOW_OPEN", (e) => {
      setState(s => {
        const id = e.payload?.id;
        if (!id) return s;
        if (s.activeWindows.includes(id)) return { ...s, focusedWindow: id };
        return {
          ...s,
          activeWindows: [...s.activeWindows, id],
          focusedWindow: id
        };
      });
    });

    const unsubWindowClose = osEventBus.subscribe("WINDOW_CLOSE", (e) => {
      setState(s => {
        const id = e.payload?.id;
        if (!id) return s;
        const newWindows = s.activeWindows.filter(w => w !== id);
        return {
          ...s,
          activeWindows: newWindows,
          focusedWindow: s.focusedWindow === id ? (newWindows[newWindows.length - 1] || null) : s.focusedWindow
        };
      });
    });

    const unsubWindowFocus = osEventBus.subscribe("WINDOW_FOCUS", (e) => {
      setState(s => ({ ...s, focusedWindow: e.payload?.id || null }));
    });

    return () => {
      clearTimeout(bootTimer);
      clearInterval(clockTimer);
      unsubThreat();
      unsubWindowOpen();
      unsubWindowClose();
      unsubWindowFocus();
    };
  }, []);

  const value = useMemo(() => ({
    state,
    emit: osEventBus.emit.bind(osEventBus),
    focusWindow: (id: string) => osEventBus.emit("WINDOW_FOCUS", { id }),
    openWindow: (id: string, payload?: any) => osEventBus.emit("WINDOW_OPEN", { id, ...payload }),
    closeWindow: (id: string) => osEventBus.emit("WINDOW_CLOSE", { id })
  }), [state]);

  return (
    <KernelContext.Provider value={value}>
      {children}
    </KernelContext.Provider>
  );
}

export function useKernel() {
  const ctx = useContext(KernelContext);
  if (!ctx) throw new Error("useKernel must be used within KernelProvider");
  return ctx;
}

export function useOptionalKernel() {
  return useContext(KernelContext);
}

// Hook to easily subscribe to events inside components
export function useOSEvent(type: OSEventType, callback: (payload: any) => void) {
  useEffect(() => {
    return osEventBus.subscribe(type, (e) => callback(e.payload));
  }, [type, callback]);
}
