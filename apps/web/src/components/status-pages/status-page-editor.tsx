"use client";

import { useState } from "react";
import {
  addMonitorToPage,
  removeMonitorFromPage,
} from "@/actions/status-pages";
import { Monitor, Plus, Trash2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { StatusPageSettings } from "./status-page-settings";
import { TrafficChart } from "../dashboard/analytics/traffic-chart";
import { StatsCards } from "../dashboard/analytics/stats-cards";

export function StatusPageEditor({
  page,
  allMonitors,
}: {
  page: any;
  allMonitors: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "monitors" | "settings" | "analytics"
  >("monitors");
  const [isPending, setIsPending] = useState(false);

  // ... (keep handleAdd/Remove) ...

  const assignedMonitorIds = new Set(
    page.monitors.map((m: any) => m.monitorId),
  );
  const availableMonitors = allMonitors.filter(
    (m) => !assignedMonitorIds.has(m.id),
  );

  const handleAdd = async (monitorId: string) => {
    setIsPending(true);
    const res = await addMonitorToPage(page.id, monitorId);
    if (res.success) {
      toast.success("Monitor added");
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsPending(false);
  };

  const handleRemove = async (monitorId: string) => {
    if (!confirm("Remove from status page?")) return;
    setIsPending(true);
    const res = await removeMonitorFromPage(page.id, monitorId);
    if (res.success) {
      toast.success("Monitor removed");
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pages"
            className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {page.title}
            </h1>
            <a
              href={`/status-page/${page.slug}`}
              target="_blank"
              className="flex items-center gap-2 text-sm text-primary hover:underline font-mono"
            >
              pulseguard.com/status-page/{page.slug}{" "}
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-secondary/20 p-1 rounded-sm border border-primary/20">
          <button
            onClick={() => setActiveTab("monitors")}
            className={`px-4 py-1.5 text-xs font-bold uppercase font-mono rounded-sm transition-all ${activeTab === "monitors" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            Monitors
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-1.5 text-xs font-bold uppercase font-mono rounded-sm transition-all ${activeTab === "analytics" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-1.5 text-xs font-bold uppercase font-mono rounded-sm transition-all ${activeTab === "settings" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === "monitors" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Config (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-primary/20 bg-primary/5 rounded-sm p-6">
              <h2 className="text-lg font-bold font-mono uppercase text-foreground mb-4 flex items-center gap-2">
                <Monitor className="size-5 text-primary" /> Active Monitors
              </h2>

              <div className="space-y-2">
                {page.monitors.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-black/50 border border-white/10 rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full ${item.monitor.status === "UP" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <span className="font-mono text-sm">
                        {item.displayName || item.monitor.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(item.monitorId)}
                      disabled={isPending}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                {page.monitors.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No monitors added yet. Select monitors from the right to add
                    them.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            <div className="border border-white/10 rounded-sm p-6 bg-[#0A0A0A]">
              <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground mb-3">
                Available Monitors
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {availableMonitors.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2 hover:bg-white/5 rounded-sm border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className={`size-1.5 rounded-full shrink-0 ${m.status === "UP" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <span className="text-xs font-mono truncate">
                        {m.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAdd(m.id)}
                      disabled={isPending}
                      className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-sm transition-all"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                ))}
                {availableMonitors.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    All monitors added.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <StatsCards pageId={page.id} />
          <div className="border border-white/10 bg-white/5 rounded-sm p-6">
            <h3 className="text-lg font-bold font-mono uppercase text-foreground mb-6">
              Traffic Overview (Last 30 Days)
            </h3>
            <TrafficChart pageId={page.id} />
          </div>
        </div>
      )}

      {activeTab === "settings" && <StatusPageSettings page={page} />}
    </div>
  );
}
