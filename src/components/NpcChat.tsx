"use client";

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type NpcChatRef = {
  triggerMessage: (trigger: string, output?: string, attemptCount?: number) => void;
};

type Message = {
  id: string;
  role: "user" | "npc";
  content: string;
};

type Props = {
  missionId: string;
  npcName: string;
};

const NpcChat = forwardRef<NpcChatRef, Props>(({ missionId, npcName }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredIdle = useRef(false);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!hasTriggeredIdle.current) {
        hasTriggeredIdle.current = true;
        triggerMessage("F");
      }
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const triggerMessage = async (trigger: string, output?: string, attemptCount?: number) => {
    setIsTyping(true);
    resetIdleTimer();

    try {
      const res = await fetch("/api/npc/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId,
          output,
          trigger,
          attemptCount,
          messageHistory: messages.slice(-10),
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let npcResponse = "";
      const newId = Date.now().toString();
      setMessages((prev) => [...prev, { id: newId, role: "npc", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.delta?.text || parsed.choices?.[0]?.delta?.content || "";
              if (delta) {
                npcResponse += delta;
                setMessages((prev) =>
                  prev.map((m) => (m.id === newId ? { ...m, content: npcResponse } : m))
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error("NPC message error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  useImperativeHandle(ref, () => ({ triggerMessage }));

  const initials = npcName.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[rgba(10,10,14,0.6)] border-t border-[rgba(255,255,255,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 w-full border-b border-[#1A1A22] bg-[rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm flex items-center justify-center text-[11px] font-black bg-[rgba(127,119,221,0.2)] text-[#AFA9EC] border border-[rgba(127,119,221,0.35)] shadow-[0_0_10px_rgba(127,119,221,0.2)]">
            {initials}
          </div>
          <div>
            <div className="text-sm font-black tracking-widest uppercase text-white">{npcName}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isTyping ? (
                <span className="font-mono text-[9px] text-[#5DCAA5] animate-pulse">
                  TRANSMITTING...
                </span>
              ) : (
                <>
                  <Radio className="w-2.5 h-2.5 text-[#5DCAA5]" />
                  <span className="font-mono text-[9px] text-[#5DCAA5]">SECURE CHANNEL</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
        {messages.length === 0 && !isTyping && (
          <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-[#2A2A35] uppercase tracking-widest">
            [ AWAITING TRANSMISSION ]
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 bg-[rgba(127,119,221,0.15)] text-[#AFA9EC] border border-[rgba(127,119,221,0.3)]">
                {initials}
              </div>
              <div className="flex-1">
                <div className="font-mono text-[9px] mb-1 text-[#534AB7] tracking-widest uppercase">
                  {npcName}
                </div>
                <div className="text-xs leading-relaxed text-[#C8C8D8]">
                  {msg.content}
                  {isTyping && msg.id === messages[messages.length - 1]?.id && msg.content === "" && (
                    <span className="inline-block w-1.5 h-3 ml-1 align-middle bg-[#7F77DD] animate-pulse" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && messages[messages.length - 1]?.content !== "" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex gap-3"
            >
              <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-black shrink-0 bg-[rgba(127,119,221,0.15)] text-[#AFA9EC] border border-[rgba(127,119,221,0.3)]">
                {initials}
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-[#7F77DD] rounded-full opacity-50 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

NpcChat.displayName = "NpcChat";
export default NpcChat;
