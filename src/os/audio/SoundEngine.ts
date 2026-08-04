"use client";

import { osEventBus } from '../events/EventBus';

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true; // Set to false if you want a mute toggle

  private init() {
    if (!this.audioCtx && typeof window !== "undefined") {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx?.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // A subtle digital click for buttons
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  // A soft synth for hovering over elements
  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.03);
  }

  // A digital ping for incoming transmissions
  playNotification() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }

  // Deep bass pulse for mission completion or threat changes
  playBassPulse() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.5);
  }
}

export const osSound = typeof window !== "undefined" ? new SoundEngine() : null;

// Connect the sound engine to the Event Bus
if (typeof window !== "undefined") {
  osEventBus.subscribe("SYSTEM_BOOT", () => {
    // Requires user interaction first usually, but we try
    osSound?.playNotification();
  });

  osEventBus.subscribe("NEW_TRANSMISSION", () => {
    osSound?.playNotification();
  });

  osEventBus.subscribe("MISSION_COMPLETED", () => {
    osSound?.playBassPulse();
  });
  
  osEventBus.subscribe("THREAT_CHANGED", () => {
    osSound?.playBassPulse();
  });
}
