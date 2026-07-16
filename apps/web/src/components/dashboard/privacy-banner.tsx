"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

export function PrivacyBanner() {
  return (
    <Link
      href="/dashboard/settings?tab=privacy"
      className="group block border border-primary/10 bg-gradient-to-r from-primary/[0.02] to-transparent hover:from-primary/[0.06] hover:border-primary/20 transition-all duration-300"
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/5 border border-primary/10 group-hover:border-primary/20 group-hover:bg-primary/10 transition-all">
            <Shield className="size-3.5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold font-mono text-foreground uppercase tracking-wider">
              Privacy-First Intelligence
            </span>
            <span className="text-[10px] text-primary/50 font-mono">
              Your uptime metrics are yours. Full transparency on data collection, retention, and
              controls.
            </span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-primary/40 uppercase tracking-widest group-hover:text-primary/70 transition-colors">
          View Privacy Report &rarr;
        </div>
      </div>
    </Link>
  );
}
