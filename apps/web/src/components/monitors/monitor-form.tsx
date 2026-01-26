"use client";

import { Activity, Globe, Server, Clock, Save, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { createMonitor, updateMonitor } from "@/actions/monitors";
import { useActionState, useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  error: "",
};

interface MonitorFormProps {
  monitor?: {
    id: string;
    name: string;
    url: string;
    type: "HTTP" | "PING" | "PORT";
    interval: number;
    timeout: number;
  };
}

/**
 * Renders a form for creating or editing a monitor configuration.
 *
 * The function initializes the form with values from the provided monitor object, handling different monitor types (HTTP, PING, PORT) and their specific input requirements. It manages form submission actions, displays success or error messages based on the submission state, and navigates to the dashboard upon successful submission.
 *
 * @param {MonitorFormProps} props - The properties for the MonitorForm component, including the monitor object.
 */
export function MonitorForm({ monitor }: MonitorFormProps) {
  // Parse initial values
  let initialType: "HTTP" | "PING" | "PORT" = monitor?.type || "HTTP";
  let initialUrl = monitor?.url || "";
  let initialPort = "";

  if (monitor) {
    if (monitor.type === "PING" && initialUrl.startsWith("ping://")) {
      initialUrl = initialUrl.replace("ping://", "");
    } else if (monitor.type === "PORT" && initialUrl.startsWith("tcp://")) {
      const trimmed = initialUrl.replace("tcp://", "");
      const [host, port] = trimmed.split(":");
      initialUrl = host;
      initialPort = port;
    }
  }

  const [monitorType, setMonitorType] = useState<"HTTP" | "PING" | "PORT">(initialType);

  const action = monitor ? updateMonitor.bind(null, monitor.id) : createMonitor;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(monitor ? "Monitor updated successfully" : "Monitor created successfully");
      router.push("/dashboard/monitors");
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, monitor]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-foreground font-mono uppercase tracking-tight flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          {monitor ? "Edit Monitor" : "New Monitor Protocol"}
        </h3>
        <p className="text-sm text-primary/60 font-mono">
          {monitor
            ? "Update your monitor configuration"
            : "Configure a new endpoint for continuous tracking"}
        </p>
      </div>

      <form
        action={formAction}
        className="bg-black/40 border border-primary/20 p-8 backdrop-blur-sm relative group"
      >
        {/* Decor */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30 group-hover:border-primary/60 transition-colors pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/30 group-hover:border-primary/60 transition-colors pointer-events-none"></div>

        <div className="flex flex-col gap-6">
          {/* Monitor Type */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Monitor Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label
                className={`flex flex-col items-center justify-center gap-2 p-4 border ${monitorType === "HTTP" ? "border-primary bg-primary/20" : "border-primary/20 bg-primary/5"} cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all group/type relative overflow-hidden`}
              >
                <input
                  type="radio"
                  name="type"
                  value="HTTP"
                  className="sr-only peer"
                  checked={monitorType === "HTTP"}
                  onChange={() => setMonitorType("HTTP")}
                />
                <Globe className="size-6 text-primary mb-1" />
                <span className="text-xs font-bold text-foreground font-mono uppercase">
                  HTTP/HTTPS
                </span>
              </label>
              <label
                className={`flex flex-col items-center justify-center gap-2 p-4 border ${monitorType === "PING" ? "border-primary bg-primary/20" : "border-primary/20 bg-primary/5"} cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all group/type relative overflow-hidden`}
              >
                <input
                  type="radio"
                  name="type"
                  value="PING"
                  className="sr-only peer"
                  checked={monitorType === "PING"}
                  onChange={() => setMonitorType("PING")}
                />
                <Activity className="size-6 text-primary mb-1" />
                <span className="text-xs font-bold text-foreground font-mono uppercase">Ping</span>
              </label>
              <label
                className={`flex flex-col items-center justify-center gap-2 p-4 border ${monitorType === "PORT" ? "border-primary bg-primary/20" : "border-primary/20 bg-primary/5"} cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all group/type relative overflow-hidden`}
              >
                <input
                  type="radio"
                  name="type"
                  value="PORT"
                  className="sr-only peer"
                  checked={monitorType === "PORT"}
                  onChange={() => setMonitorType("PORT")}
                />
                <Server className="size-6 text-primary mb-1" />
                <span className="text-xs font-bold text-foreground font-mono uppercase">Port</span>
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Friendly Name
            </label>
            <input
              name="name"
              required
              defaultValue={monitor?.name}
              className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
              type="text"
              placeholder={monitorType === "HTTP" ? "e.g. Production API" : "e.g. Game Server"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              {monitorType === "HTTP" ? "Target URL" : "Hostname / IP"}
            </label>
            <div className="flex gap-4">
              <input
                name="url"
                required
                defaultValue={initialUrl}
                className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                type="text"
                placeholder={
                  monitorType === "HTTP"
                    ? "https://api.example.com/health"
                    : "192.168.1.1 or example.com"
                }
              />
              {monitorType === "PORT" && (
                <div className="w-32">
                  <input
                    name="port"
                    required
                    defaultValue={initialPort}
                    className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    type="number"
                    placeholder="8080"
                    min="1"
                    max="65535"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Check Interval
              </label>
              <div className="relative">
                <Clock className="absolute top-3 left-3 size-4 text-primary/40 pointer-events-none" />
                <select
                  name="interval"
                  defaultValue={monitor?.interval}
                  className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 pl-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none cursor-pointer"
                >
                  <option value="30">30 Seconds</option>
                  <option value="60">1 Minute</option>
                  <option value="300">5 Minutes</option>
                  <option value="600">10 Minutes</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Request Timeout
              </label>
              <div className="relative">
                <Clock className="absolute top-3 left-3 size-4 text-primary/40 pointer-events-none" />
                <select
                  name="timeout"
                  defaultValue={monitor?.timeout}
                  className="bg-black/50 border border-primary/20 focus:border-primary/60 text-primary text-sm rounded-sm p-3 pl-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none cursor-pointer"
                >
                  <option value="5">5 Seconds</option>
                  <option value="10">10 Seconds</option>
                  <option value="30">30 Seconds</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-primary/20 my-2"></div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard/monitors"
              className="px-6 py-2.5 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2"
            >
              <X className="size-4" /> Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {monitor ? "Save Changes" : "Create Monitor"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
