"use client";

import { osEventBus } from '../events/EventBus';

const RANDOM_TRANSMISSIONS = [
  "Atlas recompiled grid nodes.",
  "Ghost intercepted secure transmission.",
  "Neural storm detected in Sector 4.",
  "District 03 security firewall bypassed.",
  "Memory clusters synchronized.",
  "Compiler queue optimized.",
  "Threat vectors updated.",
  "New exploit signatures downloaded.",
  "Vex activity detected near root node."
];

export class WorldEngine {
  private isRunning = false;
  private intervalIds: NodeJS.Timeout[] = [];

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Simulate random system events every 15-45 seconds
    this.intervalIds.push(
      setInterval(() => {
        const transmission = RANDOM_TRANSMISSIONS[Math.floor(Math.random() * RANDOM_TRANSMISSIONS.length)];
        osEventBus.emit("NEW_TRANSMISSION", { message: transmission, source: "SYSTEM" });
      }, 30000) // Base time 30s, could randomize further
    );

    // Randomly fluctuate threat level every 2 minutes
    this.intervalIds.push(
      setInterval(() => {
        const levels = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
        // Heavily weight towards LOW and MODERATE
        let index = 0;
        const rand = Math.random();
        if (rand > 0.9) index = 3;
        else if (rand > 0.7) index = 2;
        else if (rand > 0.4) index = 1;
        
        osEventBus.emit("THREAT_CHANGED", { level: levels[index] });
      }, 120000)
    );
  }

  stop() {
    this.isRunning = false;
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
  }
}

export const osWorldEngine = typeof window !== "undefined" ? new WorldEngine() : null;

// Auto-start when OS boots
if (typeof window !== "undefined") {
  osEventBus.subscribe("SYSTEM_BOOT", () => {
    osWorldEngine?.start();
  });
}
