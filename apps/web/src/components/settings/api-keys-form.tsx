"use client";

import { Key, Copy, Trash2, Plus } from "lucide-react";

const apiKeys = [
  {
    id: "pk_live_5829...",
    name: "Production API Key",
    created: "2024-05-12",
    lastUsed: "2 mins ago",
    status: "Active",
  },
  {
    id: "pk_test_9238...",
    name: "Development Key",
    created: "2024-06-01",
    lastUsed: "5 hours ago",
    status: "Active",
  },
];

/**
 * Renders a form for managing API access tokens.
 */
export function ApiKeysForm() {
  return (
    <div className="flex flex-col gap-6">
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">API Access Tokens</h3>
            <p className="text-xs text-primary/60 font-mono">Manage programmatic access credentials</p>
          </div>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 text-xs font-bold px-4 py-2 uppercase tracking-wider transition-all font-mono flex items-center gap-2">
            <Plus className="size-3" /> Generate New Key
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
            {apiKeys.map((key) => (
                <div key={key.id} className="border border-primary/10 bg-primary/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-3 bg-primary/10 rounded-sm">
                            <Key className="size-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground font-mono">{key.name}</span>
                                <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">Active</span>
                            </div>
                            <code className="text-xs text-primary/60 font-mono mt-1">{key.id}</code>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex flex-col items-end md:items-end">
                            <span className="text-[10px] text-primary/40 font-mono uppercase tracking-wider">Last Used</span>
                            <span className="text-xs text-primary/80 font-mono">{key.lastUsed}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <button className="p-2 hover:bg-primary/10 text-primary/50 hover:text-primary transition-colors" title="Copy Key">
                                <Copy className="size-4" />
                            </button>
                            <button className="p-2 hover:bg-red-500/10 text-primary/50 hover:text-red-500 transition-colors" title="Revoke Key">
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
      
      <section className="border border-primary/10 p-6 rounded-sm bg-primary/5">
        <h4 className="text-sm font-bold text-primary font-mono uppercase mb-2">Security Note</h4>
        <p className="text-xs text-primary/60 font-mono leading-relaxed">
            API keys grant full access to your PulseGuard account. Keep them secure. Do not share them in publicly accessible areas such as GitHub, client-side code, or insecure messaging apps.
        </p>
      </section>
    </div>
  );
}
