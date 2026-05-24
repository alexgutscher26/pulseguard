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
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          {monitor ? "Edit Monitor" : "New Monitor Setup"}
        </h3>
        <p className="text-xs text-muted-foreground font-medium">
          {monitor
            ? "Update your monitor configuration and threshold settings"
            : "Configure a new endpoint for continuous global verification"}
        </p>
      </div>

      <form
        action={formAction}
        className="bg-card border border-border p-6 md:p-8 rounded-xl backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
      >
        <div className="flex flex-col gap-6">
          {/* Monitor Type */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Monitor Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label
                className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  monitorType === "HTTP"
                    ? "border-primary bg-primary/5 text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    : "border-border bg-card text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="HTTP"
                  className="sr-only"
                  checked={monitorType === "HTTP"}
                  onChange={() => setMonitorType("HTTP")}
                />
                <Globe className="size-5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">HTTP/HTTPS</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  monitorType === "PING"
                    ? "border-primary bg-primary/5 text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    : "border-border bg-card text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="PING"
                  className="sr-only"
                  checked={monitorType === "PING"}
                  onChange={() => setMonitorType("PING")}
                />
                <Activity className="size-5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Ping</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  monitorType === "PORT"
                    ? "border-primary bg-primary/5 text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    : "border-border bg-card text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="PORT"
                  className="sr-only"
                  checked={monitorType === "PORT"}
                  onChange={() => setMonitorType("PORT")}
                />
                <Server className="size-5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Port</span>
              </label>
            </div>
          </div>

          {/* Friendly Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Friendly Name
            </label>
            <input
              name="name"
              required
              defaultValue={monitor?.name}
              className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full"
              type="text"
              placeholder={monitorType === "HTTP" ? "e.g. Production API" : "e.g. Game Server"}
            />
          </div>

          {/* Target Host */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {monitorType === "HTTP" ? "Target URL" : "Hostname / IP"}
            </label>
            <div className="flex gap-4">
              <input
                name="url"
                required
                defaultValue={initialUrl}
                className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full"
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
                    className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full"
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
            <div className="flex flex-col gap-5 border-l border-border pl-6 py-1">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  HTTP Method
                </label>
                <div className="relative group/select">
                  <select
                    name="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 pr-10 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full appearance-none cursor-pointer"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map((m) => (
                      <option key={m} value={m} className="bg-popover text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute top-3.5 right-3 size-3.5 text-muted-foreground/60 pointer-events-none group-focus-within/select:text-foreground transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Custom Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider transition-all cursor-pointer"
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
                        className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-2.5 text-foreground focus:outline-none flex-1"
                      />
                      <input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                        className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-2.5 text-foreground focus:outline-none flex-1"
                      />
                      {headersList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHeader(index)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="hidden"
                  name="headers"
                  value={JSON.stringify(headersList.filter((h) => h.key || h.value))}
                />
              </div>

              {["POST", "PUT", "PATCH"].includes(method) && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Request Body
                  </label>
                  <textarea
                    name="body"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full min-h-[100px] resize-y"
                    placeholder='{"key": "value"}'
                  />
                </div>
              )}
            </div>
          )}

          {/* Region Selector */}
          <RegionSelector selectedRegions={selectedRegions} onChange={setSelectedRegions} />

          {/* Alert Threshold */}
          {selectedRegions.length > 0 && (
            <div className="flex flex-col gap-2.5 p-5 border border-border bg-accent/30 rounded-xl">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
                  className="bg-card border border-border focus:border-primary/20 text-xs font-bold rounded-lg p-2 w-20 text-center text-foreground focus:outline-none"
                />
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-relaxed">
                  Only alert when at least{" "}
                  <span className="text-foreground font-extrabold">{threshold}</span> regions are
                  down
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Check Interval
              </label>
              <div className="relative group/select">
                <Clock className="absolute top-3.5 left-3 size-4 text-muted-foreground/60 pointer-events-none group-focus-within/select:text-foreground transition-colors" />
                <select
                  name="interval"
                  defaultValue={monitor?.interval}
                  className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 pl-10 pr-10 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full appearance-none cursor-pointer"
                >
                  <option value="30" className="bg-popover text-foreground">
                    30 Seconds
                  </option>
                  <option value="60" className="bg-popover text-foreground">
                    1 Minute
                  </option>
                  <option value="300" className="bg-popover text-foreground">
                    5 Minutes
                  </option>
                  <option value="600" className="bg-popover text-foreground">
                    10 Minutes
                  </option>
                </select>
                <ChevronDown className="absolute top-3.5 right-3 size-3.5 text-muted-foreground/60 pointer-events-none group-focus-within/select:text-foreground transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Request Timeout
              </label>
              <div className="relative group/select">
                <Clock className="absolute top-3.5 left-3 size-4 text-muted-foreground/60 pointer-events-none group-focus-within/select:text-foreground transition-colors" />
                <select
                  name="timeout"
                  defaultValue={monitor?.timeout}
                  className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 pl-10 pr-10 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full appearance-none cursor-pointer"
                >
                  <option value="5" className="bg-popover text-foreground">
                    5 Seconds
                  </option>
                  <option value="10" className="bg-popover text-foreground">
                    10 Seconds
                  </option>
                  <option value="30" className="bg-popover text-foreground">
                    30 Seconds
                  </option>
                </select>
                <ChevronDown className="absolute top-3.5 right-3 size-3.5 text-muted-foreground/60 pointer-events-none group-focus-within/select:text-foreground transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border border-border bg-accent/30 p-4 rounded-xl mt-1">
            <input
              type="checkbox"
              id="dynamicThresholding"
              name="dynamicThresholding"
              defaultChecked={monitor?.dynamicThresholding}
              className="accent-primary size-4 cursor-pointer rounded border-border"
            />
            <div className="flex flex-col">
              <label
                htmlFor="dynamicThresholding"
                className="text-[10px] font-bold text-foreground uppercase tracking-wider cursor-pointer"
              >
                Dynamic Timeout
              </label>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase mt-0.5 tracking-wider">
                Auto-scale timeout to p95 historical latency
              </p>
            </div>
          </div>

          {/* Runbook Url */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Remediation Runbook (Optional)
              </label>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                Attach playbook or documentation link
              </p>
            </div>
            <div className="relative group/input">
              <Book className="absolute top-3.5 left-3 size-4 text-muted-foreground/60 pointer-events-none group-focus-within/input:text-foreground transition-colors" />
              <input
                name="runbookUrl"
                value={runbookUrl}
                onChange={(e) => setRunbookUrl(e.target.value)}
                className="bg-accent/30 border border-border focus:border-primary/20 text-xs font-semibold rounded-lg p-3 pl-10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/10 transition-all w-full"
                type="url"
                placeholder="https://docs.company.com/runbooks/api-monitoring"
              />
            </div>
          </div>

          <div className="h-px bg-border my-2"></div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard/monitors"
              className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground hover:bg-accent text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <X className="size-3.5" /> Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              {monitor ? "Save Changes" : "Create Monitor"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
