"use client";

import { useState } from "react";
import CodeView from "./CodeView";
import PreviewView from "./PreviewView";

interface CodePreviewPanelProps {
  code: string;
  isStreaming: boolean;
}

type Tab = "code" | "preview";

export default function CodePreviewPanel({
  code,
  isStreaming,
}: CodePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("code");

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      {/* Tab bar */}
      <div className="flex h-[52px] shrink-0 items-center gap-1 border-b border-zinc-800 px-4">
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
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
            activeTab === "preview"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "code" ? (
          <CodeView code={code} isStreaming={isStreaming} />
        ) : (
          <PreviewView code={code} isStreaming={isStreaming} />
        )}
      </div>
    </div>
  );
}

