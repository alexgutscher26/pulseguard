"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Code2 } from "lucide-react";

interface EmbedCodeGeneratorProps {
  slug: string;
}

export function EmbedCodeGenerator({ slug }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  // Use environment variable or fallback
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://your-domain.com");

  const embedCode = `<!-- PulseGuard Status Widget -->
<div id="pulseguard-status"></div>
<script src="${baseUrl}/api/widget/embed.js?slug=${slug}"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Code2 className="size-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
              Embed Code
            </h3>
            <p className="text-xs text-muted-foreground">
              Copy and paste this code into your website
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-sm border font-mono text-xs font-bold uppercase tracking-wider transition-all",
            copied
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20",
          )}
        >
          {copied ? (
            <>
              <Check className="size-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 overflow-x-auto">
          <code className="text-sm font-mono text-zinc-300 whitespace-pre-wrap break-all">
            {embedCode}
          </code>
        </pre>
      </div>

      {/* Instructions */}
      <div className="mt-4 space-y-2 text-xs text-muted-foreground/80 font-mono">
        <p className="font-bold text-primary/80 uppercase tracking-wider">Installation:</p>
        <ol className="list-decimal list-inside space-y-1 pl-2">
          <li>Copy the code above</li>
          <li>Paste it into your website's HTML where you want the status badge to appear</li>
          <li>The widget will automatically update every 60 seconds</li>
        </ol>
      </div>

      {/* Advanced Configuration */}
      <details className="mt-4 group">
        <summary className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase tracking-wider">
          Advanced Configuration →
        </summary>
        <div className="mt-3 p-4 bg-background/50 rounded-sm border border-primary/10 space-y-3">
          <p className="text-xs text-muted-foreground">
            You can customize the target element by adding this before the script:
          </p>
          <pre className="bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
            {`<script>
  window.PulseGuard = {
    config: {
      target: 'my-custom-element-id'
    }
  };
</script>`}
          </pre>
        </div>
      </details>
    </div>
  );
}
