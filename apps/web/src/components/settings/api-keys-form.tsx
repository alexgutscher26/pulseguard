"use client";

import { Key } from "lucide-react";

/**
 * Renders a form for managing API access tokens.
 */
export function ApiKeysForm() {
  return (
    <div className="flex flex-col gap-6">
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
              API Access Tokens
            </h3>
            <p className="text-xs text-primary/60 font-mono">
              Manage programmatic access credentials
            </p>
          </div>
          <button
            disabled
            className="bg-primary/5 text-primary/50 border border-primary/10 text-xs font-bold px-4 py-2 uppercase tracking-wider font-mono cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        <div className="p-12 flex flex-col items-center justify-center text-center gap-4 text-primary/40 border-b border-primary/10">
          <div className="p-4 bg-primary/5 rounded-full border border-primary/10">
            <Key className="size-8 opacity-50" />
          </div>
          <p className="font-mono text-sm uppercase tracking-widest">
            API Keys Management Coming Soon
          </p>
        </div>
      </section>

      <section className="border border-primary/10 p-6 rounded-sm bg-primary/5">
        <h4 className="text-sm font-bold text-primary font-mono uppercase mb-2">
          Security Note
        </h4>
        <p className="text-xs text-primary/60 font-mono leading-relaxed">
          API keys grant full access to your PulseGuard account. Keep them
          secure. Do not share them in publicly accessible areas such as GitHub,
          client-side code, or insecure messaging apps.
        </p>
      </section>
    </div>
  );
}
