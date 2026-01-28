"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Timer,
  Activity,
  MoreHorizontal,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AlertEvent {
  id: string;
  monitor: { name: string; url: string };
  status: string;
  latency: number;
  timestamp: Date;
  errorReason?: string | null;
}

interface AlertHistoryProps {
  history: AlertEvent[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function AlertHistory({
  history,
  currentPage,
  totalPages,
  totalCount,
}: AlertHistoryProps) {
  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getTypeConfig = (event: AlertEvent) => {
    if (event.status === "DOWN") {
      return {
        text: event.errorReason || "System Down",
        icon: AlertTriangle,
        color: "text-red-500",
        statusColor: "text-red-500 bg-red-500/10 border-red-500/20",
      };
    }
    if (event.status === "MAINTENANCE") {
      return {
        text: "Maintenance",
        icon: Settings,
        color: "text-blue-500",
        statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      };
    }
    // UP
    if (event.latency > 1000) {
      return {
        text: `High Latency (${event.latency}ms)`,
        icon: Timer,
        color: "text-yellow-500",
        statusColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      };
    }
    return {
      text: "Operational",
      icon: CheckCircle,
      color: "text-green-500",
      statusColor: "text-green-500 bg-green-500/10 border-green-500/20",
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
            System Log
          </h3>
          <p className="text-xs text-primary/60 font-mono">
            Recent monitor events
          </p>
        </div>
      </div>

      <div className="border border-primary/20 bg-black/40 relative overflow-hidden shadow-lg backdrop-blur-sm">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 pointer-events-none"></div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">
                  Target System
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">
                  Event Type
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">
                  Details
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-xs text-primary/50 font-mono uppercase"
                  >
                    No events recorded yet
                  </td>
                </tr>
              ) : (
                history.map((item) => {
                  const config = getTypeConfig(item);
                  const Icon = config.icon;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-foreground font-mono group-hover:text-primary transition-colors">
                          {item.monitor.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon className={`size-4 ${config.color}`} />
                          <span className="text-xs font-bold text-foreground font-mono">
                            {config.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${config.statusColor}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "UP" ? (
                          <span className="text-xs text-primary/70 font-mono">
                            {item.latency}ms latency
                          </span>
                        ) : (
                          <span
                            className="text-xs text-red-400 font-mono truncate max-w-[200px] block"
                            title={item.errorReason || ""}
                          >
                            {item.errorReason || "No details"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-primary/50">
                          <Clock className="size-3" />
                          <span className="text-xs font-mono">
                            {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-primary/5 px-6 py-3 flex items-center justify-between border-t border-primary/20 font-mono">
          <p className="text-[10px] text-primary/60 uppercase tracking-widest">
            Showing page {currentPage} of {totalPages} ({totalCount} entries)
          </p>
          <div className="flex gap-2">
            <Link
              href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
              className={`px-3 py-1 border border-primary/20 text-primary/60 text-[10px] uppercase font-bold transition-all flex items-center gap-1 ${
                currentPage <= 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-primary hover:border-primary/50"
              }`}
            >
              <ChevronLeft className="size-3" /> Prev
            </Link>
            <Link
              href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
              className={`px-3 py-1 border border-primary/20 text-primary/60 text-[10px] uppercase font-bold transition-all flex items-center gap-1 ${
                currentPage >= totalPages
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:text-primary hover:border-primary/50"
              }`}
            >
              Next <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
