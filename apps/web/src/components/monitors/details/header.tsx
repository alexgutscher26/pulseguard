"use client";

import { CheckCircle, ExternalLink } from "lucide-react";
import { toggleMonitor } from "@/actions/monitors";
import { toast } from "sonner";
import { useTransition } from "react";
import { AVAILABLE_REGIONS } from "@pulseguard/shared";
import { useHaptic } from "@/hooks/use-haptic";

/**
 * Render the detailed header for a monitor, displaying its status and controls.
 *
 * This function evaluates the monitor's status, including whether it is operational, down, paused, or pending.
 * It provides controls to run a check on the monitor and toggle its monitoring state, handling asynchronous operations
 * and displaying appropriate feedback messages. The component also shows the last heartbeat time based on the monitor's events.
 *
 * @param {Object} param0 - The properties object.
 * @param {any} param0.monitor - The monitor object containing its details and status.
 * @returns {JSX.Element} The rendered monitor detail header component.
 */
export function MonitorDetailHeader({ monitor }: { monitor: any }) {
  const hasEvents = monitor.events && monitor.events.length > 0;
  const isUp = monitor.status === "UP" && hasEvents;
  const isDown = monitor.status === "DOWN";
  const isPaused = monitor.status === "PAUSED";
  // If status is "UP" but no events, it's pending first check
  const isPending = monitor.status === "UP" && !hasEvents;

  const [isLoading, startTransition] = useTransition();
  const { trigger } = useHaptic();

  const handleToggle = (enabled: boolean) => {
    trigger("medium"); // Medium vibration trigger on toggling state
    startTransition(async () => {
      const result = await toggleMonitor(monitor.id, enabled);
      if (result.success) {
        trigger("success"); // Success vibration
        toast.success(enabled ? "Monitoring resumed" : "Monitoring paused");
      } else {
        trigger("error"); // Error vibration
        toast.error(result.error || "Failed to update monitor");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm relative overflow-hidden group">
          {/* Decor */}
          <div className="absolute top-0 left-0 w-2 h-full bg-primary/10 border-r border-primary/20"></div>

          <div className="pl-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-foreground uppercase tracking-tight">
                {monitor.name}
              </h1>
              {isUp && (
                <span className="px-2.5 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="size-1.5 rounded-full bg-primary shadow-[0_0_5px_currentColor]"></span>
                  Operational
                </span>
              )}
              {isDown && (
                <span className="px-2.5 py-0.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_5px_currentColor]"></span>
                  {(monitor.events?.[0]?.errorReason || "Critical Down").split("\n")[0]}
                </span>
              )}
              {isPaused && (
                <span className="px-2.5 py-0.5 rounded-sm bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-yellow-500"></span>
                  Paused
                </span>
              )}
              {isPending && (
                <span className="px-2.5 py-0.5 rounded-sm bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="size-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_currentColor]"></span>
                  Initializing
                </span>
              )}
            </div>
            {monitor.type === "HEARTBEAT" ? (
              <div className="flex flex-col gap-1.5 mt-1">
                <p className="text-primary/60 text-xs font-mono">
                  HEARTBEAT_WEBHOOK_URL:{" "}
                  <code className="text-foreground select-all bg-zinc-950 px-2 py-1 border border-primary/10 rounded-sm">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/api/heartbeat/${monitor.heartbeatToken}`
                      : `/api/heartbeat/${monitor.heartbeatToken}`}
                  </code>
                </p>
                <p className="text-[10px] text-muted-foreground leading-normal max-w-md">
                  💡 Send a GET or POST request to this URL from your server cron job to report
                  healthy heartbeat checks.
                </p>
              </div>
            ) : (
              <p className="text-primary/60 text-xs font-mono">
                TARGET_ENDPOINT: <code className="text-foreground">{monitor.url}</code>
              </p>
            )}
            {monitor.runbookUrl && (
              <a
                href={monitor.runbookUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest font-mono border border-primary/20 bg-primary/5 px-2 py-1 rounded-sm w-fit transition-colors group/runbook"
              >
                <ExternalLink className="size-3 transition-transform group-hover/runbook:-translate-y-0.5 group-hover/runbook:translate-x-0.5" />
                Remediation Runbook
              </a>
            )}
          </div>

          <div className="flex items-center justify-end flex-1 pl-4 md:pl-0">
            <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest font-mono">
                Monitoring State
              </p>
              <label className="relative flex h-[32px] w-[56px] md:h-[24px] md:w-[44px] cursor-pointer items-center rounded-full border border-primary/20 bg-secondary/50 p-1 active:scale-95 transition-transform shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={!isPaused}
                  disabled={isLoading}
                  onChange={(e) => handleToggle(e.target.checked)}
                />
                <span className="absolute inset-0 rounded-full transition-colors peer-checked:bg-primary/20"></span>
                <span className="h-6 w-6 md:h-4 md:w-4 rounded-full bg-primary/50 shadow-sm transition-transform peer-checked:translate-x-6 md:peer-checked:translate-x-5 peer-checked:bg-primary"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Last checked card */}
      <div className="flex flex-col justify-between gap-2 rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
          <span className="flex size-2">
            <span
              className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${hasEvents ? "bg-primary" : "bg-yellow-500"}`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${hasEvents ? "bg-primary" : "bg-yellow-500"}`}
            ></span>
          </span>
        </div>
        <div>
          <p className="text-primary/50 text-[10px] font-bold uppercase tracking-widest font-mono">
            Last Heartbeat
          </p>
          <p className="text-foreground text-xl font-bold font-mono mt-1">
            {hasEvents
              ? (() => {
                  const diff = Math.floor(
                    (Date.now() - new Date(monitor.events[0].timestamp).getTime()) / 1000,
                  );
                  if (diff < 2) return "Just now";
                  if (diff < 60) return `${diff} seconds ago`;
                  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
                  return `${Math.floor(diff / 3600)} hours ago`;
                })()
              : "Pending..."}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider font-mono">
          <CheckCircle className="size-4" />
          Verified from {AVAILABLE_REGIONS.length} Nodes
        </div>
      </div>
    </div>
  );
}
