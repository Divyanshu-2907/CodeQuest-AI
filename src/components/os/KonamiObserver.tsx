"use client";

import { useEffect, useState } from "react";

export function KonamiObserver() {
  const [glitchMode, setGlitchMode] = useState(false);

  useEffect(() => {
    const konamiCode = [
      "ArrowUp", "ArrowUp",
      "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight",
      "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let position = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[position]) {
        position++;
        if (position === konamiCode.length) {
          triggerEasterEgg();
          position = 0;
        }
      } else {
        position = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerEasterEgg = () => {
    setGlitchMode(true);
    document.body.classList.add("system-override");
    
    // Play fake terminal sound if possible
    try {
      const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_73229b7a33.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    setTimeout(() => {
      setGlitchMode(false);
      document.body.classList.remove("system-override");
    }, 5000);
  };

  if (!glitchMode) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-red-900/20 mix-blend-color-burn" />
      <div className="text-red-500 font-black text-6xl tracking-widest uppercase font-mono glitch" data-text="SYSTEM OVERRIDE">
        SYSTEM OVERRIDE
      </div>
    </div>
  );
}
