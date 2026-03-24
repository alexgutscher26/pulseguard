"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Globe, ExternalLink, Settings } from "lucide-react";
import { CreateStatusPageModal } from "./create-status-page-modal";


export function StatusPageList({ initialPages }: { initialPages: any[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const getPublicLink = (page: any) => {
    if (page.customDomain) return `https://${page.customDomain}`;
    
    if (typeof window !== "undefined") {
      const host = window.location.host;
      
      // Local development or generic path-based fallback
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        return `/status-page/${page.slug}`;
      }
      
      // Production subdomain strategy:
      // Replaces the "app." prefix with the page slug (e.g., app.pulseguard.cloud -> slug.pulseguard.cloud)
      // Otherwise assumes root domain and prepends slug.
      const baseDomain = host.startsWith("app.") ? host.replace("app.", "") : host;
      return `https://${page.slug}.${baseDomain}`;
    }

    return `/status-page/${page.slug}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-foreground">
            Status Pages
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Manage your public status pages and subscribers.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90 text-black font-bold font-mono uppercase text-sm px-4 py-2 flex items-center gap-2 transition-colors rounded-sm"
        >
          <Plus className="size-4" />
          Create Page
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initialPages.map((page) => (
          <div
            key={page.id}
            className="group relative bg-[#0A0A0A] border border-primary/20 hover:border-primary/50 transition-all p-5 flex flex-col gap-4 overflow-hidden"
          >
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-sm">
                  <Globe className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground font-mono">
                    {page.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    /{page.slug}
                  </p>
                </div>
              </div>
              {page.requiresAuth && (
                <div className="px-1.5 py-0.5 border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-mono uppercase rounded-sm">
                  Private
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground relative z-10">
              <div className="flex items-center gap-1">
                <span className="text-foreground font-bold">
                  {page._count?.monitors || 0}
                </span>{" "}
                Monitors
              </div>
              {/* Future: <div className="flex items-center gap-1">
                    <span className="text-foreground font-bold">100%</span> Uptime
                </div> */}
            </div>

            <div className="flex items-center gap-2 mt-auto pt-2 border-t border-primary/10 relative z-10">
              <Link
                href={`/dashboard/pages/${page.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold font-mono uppercase py-2 transition-colors"
              >
                <Settings className="size-3.5" />
                Configure
              </Link>
              <a
                href={getPublicLink(page)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-primary/20 hover:border-primary/40 text-muted-foreground hover:text-foreground text-xs font-bold font-mono uppercase py-2 transition-colors"
              >
                <ExternalLink className="size-3.5" />
                View
              </a>
            </div>
          </div>
        ))}

        {initialPages.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border border-dashed border-primary/20 bg-primary/5 rounded-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Globe className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-mono">
              No Status Pages Yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 font-mono mb-6">
              Create a public status page to communicate system reliability to
              your users.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 text-black font-bold font-mono uppercase text-sm px-6 py-2 transition-colors rounded-sm"
            >
              Create Your First Page
            </button>
          </div>
        )}
      </div>

      <CreateStatusPageModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
