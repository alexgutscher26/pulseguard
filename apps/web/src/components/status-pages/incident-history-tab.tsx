"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface Incident {
  id: string;
  title: string;
  status: string;
  severity: string;
  startedAt: string;
  resolvedAt: string | null;
  monitor: {
    name: string;
  };
  events: Array<{
    id: string;
    type: string;
    message: string;
    createdAt: string;
  }>;
}

interface UptimeData {
  current: number;
  previous: number;
  trend: "up" | "down" | "stable";
  difference: number;
}

interface IncidentHistoryTabProps {
  incidents: Incident[];
  uptimeData: UptimeData;
  historyDays: number;
  onHistoryDaysChange: (days: number) => void;
}

export function IncidentHistoryTab({
  incidents,
  uptimeData,
  historyDays,
  onHistoryDaysChange,
}: IncidentHistoryTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(incidents.length / itemsPerPage);

  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "MONITORING":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "IDENTIFIED":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "INVESTIGATING":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-muted-foreground bg-muted/50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "text-red-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "LOW":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const formatDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-green-500";
    if (uptime >= 99) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-foreground">
            Incident History
          </h3>
          <p className="text-muted-foreground/60 text-xs font-mono">
            Past incidents and uptime statistics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono uppercase">
            Period:
          </span>
          <div className="flex rounded-sm border border-primary/20 overflow-hidden">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => onHistoryDaysChange(days)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all",
                  historyDays === days
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10",
                )}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Uptime Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-sm border border-primary/20 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono uppercase">
              Current Uptime
            </span>
            {uptimeData.trend === "up" && (
              <TrendingUp className="size-4 text-green-500" />
            )}
            {uptimeData.trend === "down" && (
              <TrendingDown className="size-4 text-red-500" />
            )}
            {uptimeData.trend === "stable" && (
              <Minus className="size-4 text-muted-foreground" />
            )}
          </div>
          <div
            className={cn(
              "text-3xl font-bold font-mono mt-2",
              getUptimeColor(uptimeData.current),
            )}
          >
            {uptimeData.current.toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground/60 mt-1 font-mono">
            {uptimeData.difference >= 0 ? "+" : ""}
            {uptimeData.difference.toFixed(2)}% vs prev. period
          </div>
        </div>

        <div className="rounded-sm border border-primary/20 bg-card/40 p-4 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground font-mono uppercase">
            Total Incidents
          </span>
          <div className="text-3xl font-bold font-mono mt-2 text-foreground">
            {incidents.length}
          </div>
          <div className="text-xs text-muted-foreground/60 mt-1 font-mono">
            Last {historyDays} days
          </div>
        </div>

        <div className="rounded-sm border border-primary/20 bg-card/40 p-4 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground font-mono uppercase">
            Active Now
          </span>
          <div className="text-3xl font-bold font-mono mt-2 text-foreground">
            {incidents.filter((i) => i.status !== "RESOLVED").length}
          </div>
          <div className="text-xs text-muted-foreground/60 mt-1 font-mono">
            Unresolved incidents
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-sm border border-primary/20 bg-card/40 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-primary/20 bg-primary/5">
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Status
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Incident
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono hidden md:table-cell">
                Monitor
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono hidden sm:table-cell">
                Duration
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono text-right">
                Started
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {paginatedIncidents.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground/40 font-mono text-xs uppercase tracking-widest"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="size-8 text-green-500/30" />
                    No incidents recorded. Systems stable.
                  </div>
                </td>
              </tr>
            )}
            {paginatedIncidents.map((incident) => (
              <tr
                key={incident.id}
                className="hover:bg-primary/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm border",
                      getStatusColor(incident.status),
                    )}
                  >
                    {incident.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={cn(
                        "size-4 mt-0.5 shrink-0",
                        getSeverityColor(incident.severity),
                      )}
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {incident.title}
                      </div>
                      <div className="text-xs text-muted-foreground/60 font-mono md:hidden">
                        {incident.monitor.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="text-xs font-mono text-muted-foreground">
                    {incident.monitor.name}
                  </span>
                </td>
                <td className="py-4 px-4 hidden sm:table-cell">
                  <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDuration(incident.startedAt, incident.resolvedAt)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-xs font-mono text-muted-foreground">
                    {new Date(incident.startedAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-primary/10 p-4">
            <span className="text-[10px] text-muted-foreground/50 uppercase font-mono tracking-widest">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 disabled:opacity-20 transition-all rounded-sm"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center text-[10px] font-mono font-bold transition-all border",
                        currentPage === page
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-primary/10 text-primary/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5",
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 disabled:opacity-20 transition-all rounded-sm"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
