"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useOptionalKernel } from "@/os/kernel/KernelProvider";

export function NeuralBackground() {
  const kernel = typeof window !== 'undefined' ? useOptionalKernel() : null;
  const threatLevel = kernel?.state?.threatLevel || 'LOW';
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Base coloring based on threat
  const baseColor = useMemo(() => {
    switch (threatLevel) {
      case 'CRITICAL': return 'rgba(239, 68, 68, 0.4)'; // Red
      case 'HIGH': return 'rgba(249, 115, 22, 0.3)'; // Orange
      case 'MODERATE': return 'rgba(234, 179, 8, 0.2)'; // Yellow
      default: return 'rgba(127, 119, 221, 0.15)'; // Purple (Default)
    }
  }, [threatLevel]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[var(--color-background)]">
      {/* Dynamic Background Grid */}
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"
        style={{
          maskImage: "linear-gradient(180deg, white, rgba(255,255,255,0))",
          WebkitMaskImage: "linear-gradient(180deg, white, rgba(255,255,255,0))"
        }}
      />
      
      {/* Primary Ambient Glow (tracks mouse slowly via framer-motion) */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{ backgroundColor: baseColor }}
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 50, mass: 2 }}
      />

      {/* Secondary Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse duration-7000" />
    </div>
  );
}
