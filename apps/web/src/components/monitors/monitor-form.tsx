"use client";

import { Activity, Globe, Server, Clock, Save, X, Loader2, ChevronDown, Book } from "lucide-react";
import Link from "next/link";
import { createMonitor, updateMonitor } from "@/actions/monitors";
import { useActionState, useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { RegionSelector } from "./region-selector";

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
    checkRegions?: string | null;
    alertThreshold?: number;
    dynamicThresholding?: boolean;
    runbookUrl?: string | null;
    method?: string;
    headers?: string | null;
    body?: string | null;
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
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type")?.toUpperCase() as "HTTP" | "PING" | "PORT" | null;

  // Parse initial values
  let initialType: "HTTP" | "PING" | "PORT" = monitor?.type || typeParam || "HTTP";
  let initialUrl = monitor?.url || "";
  let initialPort = "";
  let initialRegions: string[] = [];

  // Parse checkRegions
  if (monitor?.checkRegions) {
    try {
      initialRegions = JSON.parse(monitor.checkRegions);
    } catch (e) {
      console.error("Failed to parse checkRegions:", e);
    }
  }

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
  const [selectedRegions, setSelectedRegions] = useState<string[]>(initialRegions);
  const [threshold, setThreshold] = useState(monitor?.alertThreshold || 1);
  const [runbookUrl, setRunbookUrl] = useState(monitor?.runbookUrl || "");

  // HTTP Customization State
  const [method, setMethod] = useState(monitor?.method || "GET");
  const [headersList, setHeadersList] = useState<{ key: string; value: string }[]>(() => {
    if (monitor?.headers) {
      try {
        const parsed = JSON.parse(monitor.headers);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse headers:", e);
      }
    }
    return [{ key: "", value: "" }];
  });
  const [requestBody, setRequestBody] = useState(monitor?.body || "");

  const addHeader = () => setHeadersList([...headersList, { key: "", value: "" }]);
  const removeHeader = (index: number) => setHeadersList(headersList.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newList = [...headersList];
    newList[index][field] = value;
    setHeadersList(newList);
  };

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
        className="bg-card/40 border border-primary/20 p-8 backdrop-blur-sm relative group"
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
              className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
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
                className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
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
                    className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                    type="number"
                    placeholder="8080"
                    min="1"
                    max="65535"
                  />
                </div>
              )}
            </div>
          </div>

          {/* HTTP Advanced Config */}
          {monitorType === "HTTP" && (
            <div className="flex flex-col gap-6 border-l-2 border-primary/20 pl-6 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  HTTP Method
                </label>
                <div className="relative group/select">
                  <select
                    name="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 pr-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none cursor-pointer"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map((m) => (
                      <option key={m} value={m} className="bg-background text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute top-3.5 right-3 size-3 text-primary/40 pointer-events-none group-focus-within/select:text-primary transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                    Custom Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase font-mono transition-colors"
                  >
                    + Add Header
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {headersList.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                        className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-xs rounded-sm p-2 font-mono flex-1 focus:outline-none"
                      />
                      <input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                        className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-xs rounded-sm p-2 font-mono flex-1 focus:outline-none"
                      />
                      {headersList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHeader(index)}
                          className="p-2 text-primary/40 hover:text-red-500 transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Hidden input to stringify headers for form submission */}
                <input
                  type="hidden"
                  name="headers"
                  value={JSON.stringify(headersList.filter((h) => h.key || h.value))}
                />
              </div>

              {["POST", "PUT", "PATCH"].includes(method) && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                    Request Body
                  </label>
                  <textarea
                    name="body"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full min-h-[100px] resize-y"
                    placeholder='{"key": "value"}'
                  />
                </div>
              )}
            </div>
          )}

          {/* Region Selector */}
          <RegionSelector selectedRegions={selectedRegions} onChange={setSelectedRegions} />

          {/* Alert Threshold (Only if regions are selected) */}
          {selectedRegions.length > 0 && (
            <div className="flex flex-col gap-1.5 p-4 border border-primary/20 bg-primary/5 rounded-sm">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Alert Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  name="alertThreshold"
                  type="number"
                  min="1"
                  max={selectedRegions.length}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
                  className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-2 w-20 font-mono focus:outline-none"
                />
                <p className="text-[10px] text-primary/60 font-mono uppercase">
                  Only alert when at least{" "}
                  <span className="text-primary font-bold">{threshold}</span> regions are down
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Check Interval
              </label>
              <div className="relative group/select">
                <Clock className="absolute top-3 left-3 size-4 text-primary/40 pointer-events-none group-focus-within/select:text-primary transition-colors" />
                <select
                  name="interval"
                  defaultValue={monitor?.interval}
                  className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 pl-10 pr-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none cursor-pointer"
                >
                  <option value="30" className="bg-background text-foreground">
                    30 Seconds
                  </option>
                  <option value="60" className="bg-background text-foreground">
                    1 Minute
                  </option>
                  <option value="300" className="bg-background text-foreground">
                    5 Minutes
                  </option>
                  <option value="600" className="bg-background text-foreground">
                    10 Minutes
                  </option>
                </select>
                <ChevronDown className="absolute top-3.5 right-3 size-3 text-primary/40 pointer-events-none group-focus-within/select:text-primary transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Request Timeout
              </label>
              <div className="relative group/select">
                <Clock className="absolute top-3 left-3 size-4 text-primary/40 pointer-events-none group-focus-within/select:text-primary transition-colors" />
                <select
                  name="timeout"
                  defaultValue={monitor?.timeout}
                  className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 pl-10 pr-10 font-mono focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full appearance-none cursor-pointer"
                >
                  <option value="5" className="bg-background text-foreground">
                    5 Seconds
                  </option>
                  <option value="10" className="bg-background text-foreground">
                    10 Seconds
                  </option>
                  <option value="30" className="bg-background text-foreground">
                    30 Seconds
                  </option>
                </select>
                <ChevronDown className="absolute top-3.5 right-3 size-3 text-primary/40 pointer-events-none group-focus-within/select:text-primary transition-colors" />
              </div>
              <div className="mt-2 flex items-center gap-3 border border-primary/20 bg-primary/5 p-3 rounded-sm">
                <input
                  type="checkbox"
                  id="dynamicThresholding"
                  name="dynamicThresholding"
                  defaultChecked={monitor?.dynamicThresholding}
                  className="accent-primary size-4 cursor-pointer"
                />
                <div className="flex flex-col">
                  <label
                    htmlFor="dynamicThresholding"
                    className="text-[10px] font-bold text-foreground font-mono uppercase cursor-pointer"
                  >
                    Dynamic Timeout
                  </label>
                  <p className="text-[9px] text-primary/60 font-mono mt-0.5 max-w-[150px]">
                    Auto-scale timeout to p95 historical latency
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                Remediation Runbook (Optional)
              </label>
              <div className="flex items-center gap-1.5 text-primary/40 group-hover:text-primary transition-colors cursor-help">
                <p className="text-[9px] font-mono italic">Attach Confluence or Markdown link</p>
              </div>
            </div>
            <div className="relative group/input">
              <Book className="absolute top-3 left-3 size-4 text-primary/40 pointer-events-none group-focus-within/input:text-primary transition-colors" />
              <input
                name="runbookUrl"
                value={runbookUrl}
                onChange={(e) => setRunbookUrl(e.target.value)}
                className="bg-secondary/20 border border-primary/20 focus:border-primary/60 text-foreground text-sm rounded-sm p-3 pl-10 font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                type="url"
                placeholder="https://confluence.company.com/runbook/monitor-01"
              />
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
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
