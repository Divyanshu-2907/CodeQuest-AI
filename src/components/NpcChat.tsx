"use client";

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isExpanded, setIsExpanded] = useState(true);
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
    setIsExpanded(true);
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
    <div
      className="flex flex-col rounded-lg overflow-hidden"
      style={{ background: "#09090D", border: "1px solid #1A1A22" }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded((p) => !p)}
        className="flex items-center justify-between px-4 py-3 w-full text-left transition-colors hover:bg-white/[0.02]"
        style={{ borderBottom: isExpanded ? "1px solid #1A1A22" : "none" }}
      >
        <div className="flex items-center gap-3">
          {/* NPC avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
            style={{ background: "rgba(127,119,221,0.2)", color: "#AFA9EC", border: "1px solid rgba(127,119,221,0.35)" }}
          >
            {initials}
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">{npcName}</div>
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <span className="font-mono text-[9px]" style={{ color: "#5DCAA5" }}>
                  transmitting...
                </span>
              ) : (
                <>
                  <Radio className="w-2.5 h-2.5" style={{ color: "#5DCAA5" }} />
                  <span className="font-mono text-[9px]" style={{ color: "#5DCAA5" }}>
                    SECURE CHANNEL
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" style={{ color: "#6B6A72" }} />
        ) : (
          <ChevronUp className="w-4 h-4" style={{ color: "#6B6A72" }} />
        )}
      </button>

      {/* Messages */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex flex-col gap-3 p-4 overflow-y-auto custom-scrollbar"
              style={{ maxHeight: "260px", minHeight: "120px" }}
            >
              {messages.length === 0 && !isTyping && (
                <div
                  className="font-mono text-xs text-center py-4"
                  style={{ color: "#2A2A35" }}
                >
                  — awaiting transmission —
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                    style={{
                      background: "rgba(127,119,221,0.15)",
                      color: "#AFA9EC",
                      border: "1px solid rgba(127,119,221,0.3)",
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] mb-1" style={{ color: "#534AB7" }}>
                      {npcName.toUpperCase()}
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#C8C8D8", fontFamily: "inherit" }}
                    >
                      {msg.content}
                      {isTyping &&
                        msg.id === messages[messages.length - 1]?.id &&
                        msg.content === "" && (
                          <span
                            className="terminal-cursor inline-block w-1.5 h-3 ml-0.5 align-middle"
                            style={{ background: "#7F77DD" }}
                          />
                        )}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && messages[messages.length - 1]?.content !== "" && (
                <div className="flex gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{
                      background: "rgba(127,119,221,0.15)",
                      color: "#AFA9EC",
                      border: "1px solid rgba(127,119,221,0.3)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: "#7F77DD",
                          animation: `active-ping 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

NpcChat.displayName = "NpcChat";
export default NpcChat;
