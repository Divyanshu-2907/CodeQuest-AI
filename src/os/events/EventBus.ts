// Simple pub/sub event bus for the OS
export type OSEventType = 
  | "SYSTEM_BOOT"
  | "THREAT_CHANGED"
  | "MISSION_STARTED"
  | "MISSION_COMPLETED"
  | "COMPILER_RUNNING"
  | "COMPILER_SUCCESS"
  | "COMPILER_FAILED"
  | "NEW_TRANSMISSION"
  | "NODE_UNLOCKED"
  | "AI_MESSAGE"
  | "DISTRICT_UPDATED"
  | "XP_GAINED"
  | "LEVEL_UP"
  | "SYSTEM_WARNING"
  | "WINDOW_OPEN"
  | "WINDOW_CLOSE"
  | "WINDOW_FOCUS";

export interface OSEvent {
  type: OSEventType;
  payload?: any;
  timestamp: number;
}

type EventCallback = (event: OSEvent) => void;

class EventBus {
  private listeners: Map<OSEventType, Set<EventCallback>> = new Map();
  private history: OSEvent[] = [];

  subscribe(type: OSEventType, callback: EventCallback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return an unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    };
  }

  emit(type: OSEventType, payload?: any) {
    const event: OSEvent = { type, payload, timestamp: Date.now() };
    this.history.unshift(event);
    
    // Keep history reasonably sized
    if (this.history.length > 1000) {
      this.history.pop();
    }

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach(callback => {
        try {
          callback(event);
        } catch (e) {
          console.error(`Error in event listener for ${type}:`, e);
        }
      });
    }
  }

  getHistory() {
    return this.history;
  }
}

export const osEventBus = new EventBus();
