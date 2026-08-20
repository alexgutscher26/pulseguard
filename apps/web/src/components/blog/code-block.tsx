"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const displayLang = language ? language.toUpperCase() : "CODE";

  return (
    <div className="my-6 rounded-xl border border-border/80 bg-zinc-950/90 shadow-2xl overflow-hidden group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border-b border-border/60 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-primary/70" />
          <span className="font-semibold text-[11px] text-zinc-300">
            {filename || displayLang}
          </span>
          {filename && language && (
            <span className="text-[10px] text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[10px]">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span className="font-mono text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 sm:p-5 overflow-x-auto font-mono text-[13px] leading-relaxed text-zinc-200 selection:bg-primary/20 selection:text-primary">
        <pre className="m-0 p-0 font-mono">{code}</pre>
      </div>
    </div>
  );
}

export default CodeBlock;
