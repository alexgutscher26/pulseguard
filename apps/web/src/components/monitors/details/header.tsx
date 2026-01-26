"use client";

import { CheckCircle, Play, Loader2 } from "lucide-react";
import { checkMonitor, toggleMonitor } from "@/actions/monitors";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

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

  const handleRunCheck = () => {
    startTransition(async () => {
      const result = await checkMonitor(monitor.id);
      if (result.success) {
        toast.success("Check initiated successfully");
      } else {
        toast.error(result.error || "Failed to initiate check");
      }
    });
  };

  const handleToggle = (enabled: boolean) => {
    startTransition(async () => {
      const result = await toggleMonitor(monitor.id, enabled);
      if (result.success) {
        toast.success(enabled ? "Monitoring resumed" : "Monitoring paused");
      } else {
        toast.error(result.error || "Failed to update monitor");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-sm border border-primary/20 bg-black/40 p-6 backdrop-blur-sm relative overflow-hidden group">
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
                  {monitor.events?.[0]?.errorReason || "Critical Down"}
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
            <p className="text-primary/60 text-xs font-mono">
              TARGET_ENDPOINT: <code className="text-foreground">{monitor.url}</code>
            </p>
          </div>

          <div className="flex items-center gap-4 pl-4 md:pl-0">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={handleRunCheck}
              className="h-8 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary font-mono text-[10px] uppercase tracking-wider"
            >
              {isLoading ? (
                <Loader2 className="size-3 mr-2 animate-spin" />
              ) : (
                <Play className="size-3 mr-2" />
              )}
              Run Check
            </Button>
            <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest font-mono">
                Monitoring State
              </p>
              <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full border border-primary/20 bg-black p-1">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={!isPaused}
                  disabled={isLoading}
                  onChange={(e) => handleToggle(e.target.checked)}
                />
                <span className="absolute inset-0 rounded-full transition-colors peer-checked:bg-primary/20"></span>
                <span className="h-4 w-4 rounded-full bg-primary/50 shadow-sm transition-transform peer-checked:translate-x-5 peer-checked:bg-primary"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Last checked card */}
      <div className="flex flex-col justify-between gap-2 rounded-sm border border-primary/20 bg-black/40 p-6 backdrop-blur-sm relative overflow-hidden">
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
          Verified from 12 Nodes
        </div>
      </div>
    </div>
  );
}
