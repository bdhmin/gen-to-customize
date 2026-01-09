"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ChatPanel, { Message } from "./components/ChatPanel";
import CodePreviewPanel from "./components/CodePreviewPanel";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [splitPosition, setSplitPosition] = useState(38.2); // golden ratio: ~38.2% : ~61.8%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      
      // Clamp between 25% and 75%
      setSplitPosition(Math.min(75, Math.max(25, percentage)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleSend = useCallback(async (prompt: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    setGeneratedCode("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullCode = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullCode += chunk;
          setGeneratedCode(fullCode);
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Component generated successfully! Check the Code tab to see the result.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, there was an error generating the component. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* Left Panel - Chat */}
      <div 
        className="h-full shrink-0"
        style={{ width: `${splitPosition}%` }}
      >
        <ChatPanel
          messages={messages}
          onSend={handleSend}
          isGenerating={isGenerating}
        />
      </div>

      {/* Resizable Divider */}
      <div
        className={`group relative h-full w-1 shrink-0 cursor-col-resize bg-zinc-800 transition-colors hover:bg-emerald-500 ${
          isDragging ? "bg-emerald-500" : ""
        }`}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className={`absolute inset-y-0 -left-1 -right-1 ${isDragging ? "bg-emerald-500/10" : ""}`} />
      </div>

      {/* Right Panel - Code/Preview */}
      <div className="h-full min-w-0 flex-1">
        <CodePreviewPanel code={generatedCode} isStreaming={isGenerating} />
      </div>
    </div>
  );
}
