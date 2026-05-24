"use client";

import { env } from "@pulseguard/env/web";

import { useState, useEffect } from "react";
import {
  addMonitorToPage,
  removeMonitorFromPage,
  getStatusPageIncidents,
  getStatusPageMaintenance,
  updateHistoryDays,
  getStatusPageUptimeData,
} from "@/actions/status-pages";
import { Monitor, Plus, Trash2, ArrowLeft, ExternalLink, History, Code2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { StatusPageSettings } from "./status-page-settings";
import { TrafficChart } from "../dashboard/analytics/traffic-chart";
import { StatsCards } from "../dashboard/analytics/stats-cards";
import { IncidentHistoryTab } from "./incident-history-tab";
import { MaintenanceTimeline } from "./maintenance-timeline";
import { UptimePercentageCard } from "./uptime-percentage-card";
import { WidgetConfigurator } from "./widget-configurator";

type TabType = "monitors" | "settings" | "analytics" | "history" | "widget";

export function StatusPageEditor({ page, allMonitors }: { page: any; allMonitors: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("monitors");
  const [isPending, setIsPending] = useState(false);

  // History tab state
  const [historyDays, setHistoryDays] = useState(page.historyDays || 90);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [uptimeData, setUptimeData] = useState({
    current: 100,
    previous: 100,
    trend: "stable" as "up" | "down" | "stable",
    difference: 0,
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load history data when tab becomes active or days change
  useEffect(() => {
    if (activeTab === "history") {
      loadHistoryData();
    }
  }, [activeTab, historyDays]);

  const loadHistoryData = async () => {
    setIsLoadingHistory(true);
    try {
      const [incidentsData, maintenanceData] = await Promise.all([
        getStatusPageIncidents(page.id, historyDays),
        getStatusPageMaintenance(page.id),
      ]);

      setIncidents(incidentsData);
      setMaintenance(maintenanceData);

      // Get uptime data via server action
      const trendData = await getStatusPageUptimeData(page.id, historyDays);
      setUptimeData(trendData);
    } catch (error) {
      console.error("Failed to load history data:", error);
      toast.error("Failed to load history data");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleHistoryDaysChange = async (days: number) => {
    setHistoryDays(days);
    const result = await updateHistoryDays(page.id, days);
    if (!result.success) {
      toast.error(result.error || "Failed to update history setting");
    }
  };

  const assignedMonitorIds = new Set(page.monitors.map((m: any) => m.monitorId));
  const availableMonitors = allMonitors.filter((m) => !assignedMonitorIds.has(m.id));

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

  const tabs: { id: TabType; label: string; icon?: React.ReactNode }[] = [
    { id: "monitors", label: "Monitors" },
    { id: "history", label: "History", icon: <History className="size-3" /> },
    { id: "widget", label: "Widget", icon: <Code2 className="size-3" /> },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
              {env.NEXT_PUBLIC_APP_URL.replace("https://", "").replace("http://", "")}/status-page/
              {page.slug} <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-secondary/20 p-1 rounded-sm border border-primary/20 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase font-mono rounded-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-black"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
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
                    No monitors added yet. Select monitors from the right to add them.
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
                      <span className="text-xs font-mono truncate">{m.name}</span>
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
                  <p className="text-xs text-muted-foreground">All monitors added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Uptime Card */}
              <div className="lg:col-span-1">
                <UptimePercentageCard
                  current={uptimeData.current}
                  previous={uptimeData.previous}
                  trend={uptimeData.trend}
                  difference={uptimeData.difference}
                  period={historyDays}
                />
              </div>

              {/* Maintenance Timeline */}
              <div className="lg:col-span-2">
                <MaintenanceTimeline maintenanceWindows={maintenance} />
              </div>

              {/* Incident History */}
              <div className="lg:col-span-3">
                <IncidentHistoryTab
                  incidents={incidents}
                  uptimeData={uptimeData}
                  historyDays={historyDays}
                  onHistoryDaysChange={handleHistoryDaysChange}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "widget" && (
        <WidgetConfigurator
          pageId={page.id}
          pageSlug={page.slug}
          initialConfig={{
            widgetEnabled: page.widgetEnabled || false,
            widgetAllowedDomains: page.widgetAllowedDomains || null,
            widgetBadgeText: page.widgetBadgeText || null,
            widgetTheme: page.widgetTheme || null,
          }}
        />
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
