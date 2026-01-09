"use client";

import { useState } from "react";
import CodeView from "./CodeView";
import PreviewView from "./PreviewView";

interface CodePreviewPanelProps {
  code: string;
  isStreaming: boolean;
}

type Tab = "ui" | "code";

export default function CodePreviewPanel({
  code,
  isStreaming,
}: CodePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ui");

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      {/* Tab bar */}
      <div className="flex h-[52px] shrink-0 items-center gap-1 border-b border-zinc-800 px-4">
        <button
          onClick={() => setActiveTab("ui")}
          className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
            activeTab === "ui"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          UI
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
            activeTab === "code"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          Code
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "ui" ? (
          <PreviewView code={code} isStreaming={isStreaming} />
        ) : (
          <CodeView code={code} isStreaming={isStreaming} />
        )}
      </div>
    </div>
  );
}

