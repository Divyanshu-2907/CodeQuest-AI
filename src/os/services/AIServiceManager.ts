"use client";

import { osEventBus } from '../events/EventBus';

export type AIPersona = "GHOST" | "ATLAS" | "NOVA" | "ORACLE" | "VEX";

interface AIMessage {
  persona: AIPersona;
  message: string;
  type: "INFO" | "WARNING" | "CRITICAL";
}

class AIServiceManager {
  private activeAIs = new Set<AIPersona>(["GHOST", "ATLAS"]);
  
  activate(persona: AIPersona) {
    this.activeAIs.add(persona);
  }

  deactivate(persona: AIPersona) {
    this.activeAIs.delete(persona);
  }

  sendMessage(persona: AIPersona, message: string, type: "INFO" | "WARNING" | "CRITICAL" = "INFO") {
    if (!this.activeAIs.has(persona)) return;
    
    osEventBus.emit("AI_MESSAGE", {
      persona,
      message,
      type
    });
  }

  // Ghost occasionally speaks up
  triggerRandomGhostThought() {
    const thoughts = [
      "I'm analyzing the latest network packets. Looks quiet...",
      "Atlas is consuming a lot of memory today.",
      "Don't forget to optimize your loops.",
      "I detect a weak firewall in District 04.",
      "Ready for the next mission when you are."
    ];
    this.sendMessage("GHOST", thoughts[Math.floor(Math.random() * thoughts.length)]);
  }
}

export const osAIService = typeof window !== "undefined" ? new AIServiceManager() : null;

// Hook up random AI thoughts to WorldEngine transmissions
if (typeof window !== "undefined") {
  osEventBus.subscribe("NEW_TRANSMISSION", () => {
    // 30% chance Ghost comments on a transmission
    if (Math.random() > 0.7) {
      setTimeout(() => {
        osAIService?.triggerRandomGhostThought();
      }, 2000);
    }
  });
}
