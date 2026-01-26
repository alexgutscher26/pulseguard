"use client";

import { AlertTriangle } from "lucide-react";

export function DangerZone() {
  return (
    <section className="bg-black/40 border border-red-500/30 relative overflow-hidden backdrop-blur-sm hover:border-red-500/60 transition-all">
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
            <AlertTriangle className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-red-500 font-mono uppercase tracking-tight">
              Danger Zone
            </h3>
            <p className="text-xs text-red-500/70 font-mono">
              Permanently delete account and all associated data. This action is irreversible.
            </p>
          </div>
        </div>
        <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 text-xs font-bold px-4 py-2 uppercase tracking-wider border border-red-500/30 hover:border-red-500/60 transition-all font-mono whitespace-nowrap">
          Delete Account
        </button>
      </div>
    </section>
  );
}
