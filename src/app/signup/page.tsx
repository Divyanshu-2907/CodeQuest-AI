"use client";

import React, { useState, useEffect } from "react";
import BootSequence from "@/components/auth/BootSequence";
import GatewayHUD from "@/components/auth/GatewayHUD";
import CinematicSignupCard from "@/components/auth/CinematicSignupCard";
import { motion } from "framer-motion";

export default function NeuralSignupPage() {
  const [booting, setBooting] = useState(true);
  const [showInterface, setShowInterface] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBootComplete = () => {
    setBooting(false);
    setTimeout(() => {
      setShowInterface(true);
    }, 200);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] text-white relative overflow-hidden items-center justify-center">
      
      {/* Boot Sequence Overlay */}
      {booting && <BootSequence onComplete={handleBootComplete} />}

      {/* Persistent Environment (Behind the Boot Screen) */}
      
      {/* Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(93,202,165,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,165,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "center center"
        }}
      />

      {/* Volumetric Lights */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#5DCAA5]/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#7F77DD]/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)" }} />

      {/* The Master Interface */}
      {!booting && showInterface && (
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          {/* Side Panels */}
          <GatewayHUD />
          
          {/* Center Card */}
          <CinematicSignupCard />
        </motion.div>
      )}

    </div>
  );
}
