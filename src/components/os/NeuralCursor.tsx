"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NeuralCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
  const particleId = useRef(0);
  const rippleId = useRef(0);
  const lastEmitTime = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    // Add custom class to body for OS-level cursor hiding
    document.body.classList.add("neural-os");

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Emit particles
      const now = Date.now();
      if (now - lastEmitTime.current > 40) { // Emit every 40ms
        setParticles((prev) => [
          ...prev, 
          { id: particleId.current++, x: e.clientX, y: e.clientY }
        ].slice(-20)); // Keep last 20 particles
        lastEmitTime.current = now;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setRipples((prev) => [
        ...prev,
        { id: rippleId.current++, x: e.clientX, y: e.clientY }
      ].slice(-5));
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      document.body.classList.remove("neural-os");
    };
  }, []);

  // Auto-cleanup particles
  useEffect(() => {
    const int = setInterval(() => {
      setParticles(prev => prev.length > 0 ? prev.slice(1) : []);
    }, 100);
    return () => clearInterval(int);
  }, []);

  // Cleanup ripples
  useEffect(() => {
    const int = setInterval(() => {
      setRipples(prev => prev.length > 0 ? prev.slice(1) : []);
    }, 500);
    return () => clearInterval(int);
  }, []);

  return (
    <>
      {/* The trailing ring (uses framer motion spring for lag) */}
      <motion.div
        className={cn("neural-cursor-ring", isHovering && "active")}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.5,
        }}
      />
      
      {/* The precise dot */}
      <div
        className="neural-cursor-dot"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* Particle Trails */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1, x: p.x - 3, y: p.y - 3 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed w-1.5 h-1.5 bg-[#7F77DD] rounded-full pointer-events-none z-[10000]"
          />
        ))}
      </AnimatePresence>

      {/* Click Ripples */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0.8, scale: 0, x: r.x - 24, y: r.y - 24 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed w-12 h-12 border border-[#5DCAA5] rounded-full pointer-events-none z-[9999]"
          />
        ))}
      </AnimatePresence>
    </>
  );
}
