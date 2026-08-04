"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// A provider that attaches a mouse move listener and calculates a 3D offset
export default function AmbientCamera({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full perspective-1000 overflow-hidden">
      <motion.div
        className="w-full h-full transform-style-3d"
        animate={{
          rotateX: mousePos.y * -2, // Subtle tilt
          rotateY: mousePos.x * 2,
          x: mousePos.x * -10, // Subtle pan
          y: mousePos.y * -10,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
