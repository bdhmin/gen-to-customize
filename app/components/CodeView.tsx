"use client";

import { useEffect, useState, useRef } from "react";
import { codeToHtml } from "shiki";

interface CodeViewProps {
  code: string;
  isStreaming: boolean;
}

export default function CodeView({ code, isStreaming }: CodeViewProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const lastCodeRef = useRef<string>("");

  useEffect(() => {
    // Only re-highlight if code changed significantly or streaming stopped
    const shouldHighlight =
      !isStreaming ||
      code.length - lastCodeRef.current.length > 50 ||
      code.length === 0;

    if (shouldHighlight && code) {
      lastCodeRef.current = code;
      codeToHtml(code, {
        lang: "tsx",
        theme: "github-dark",
      }).then(setHighlightedHtml);
    } else if (!code) {
      setHighlightedHtml("");
    }
  }, [code, isStreaming]);

  useEffect(() => {
    // Auto-scroll to bottom while streaming
    if (isStreaming && codeContainerRef.current) {
      codeContainerRef.current.scrollTop =
        codeContainerRef.current.scrollHeight;
    }
  }, [code, isStreaming]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  if (!code) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#0d0d0d] text-center">
        <div className="mb-4 rounded-full bg-[#1a1a1a] p-4">
          <svg
            className="h-8 w-8 text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-medium text-zinc-400">No code yet</h3>
        <p className="max-w-xs text-sm text-zinc-600">
          Generated code will appear here as it streams
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      {/* Toolbar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#1a1a1a] px-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-500">
            GeneratedComponent.tsx
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/30 px-2.5 py-1 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Streaming
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-[#1a1a1a] hover:text-zinc-300"
          title="Copy code"
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
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Code container */}
      <div
        ref={codeContainerRef}
        className="flex-1 overflow-auto p-5 font-mono text-sm leading-relaxed"
      >
        {highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className="[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
          />
        ) : (
          <pre className="whitespace-pre-wrap text-zinc-400">
            <code>{code}</code>
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-emerald-500" />
            )}
          </pre>
        )}
      </div>
    </div>
  );
}

