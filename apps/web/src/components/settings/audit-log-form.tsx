"use client";

import { useState, useEffect, useCallback } from "react";
import {
  History,
  Search,
  Shield,
  RefreshCw,
  Loader2,
  User,
  Key,
  Building2,
} from "lucide-react";
import { getWorkspaceAuditLogs } from "@/actions/team";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AuditLogItem {
  id: string;
  action: string;
  resource: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getActionBadge(action: string) {
  if (
    action.includes("invited") ||
    action.includes("joined") ||
    action.includes("created")
  ) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
  if (
    action.includes("removed") ||
    action.includes("deleted") ||
    action.includes("canceled")
  ) {
    return "bg-red-500/10 text-red-400 border-red-500/30";
  }
  if (action.includes("updated") || action.includes("role")) {
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
  }
  return "bg-slate-500/10 text-slate-400 border-slate-500/30";
}

export function AuditLogForm() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkspaceAuditLogs();
      setLogs(res);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      log.user.email.toLowerCase().includes(q) ||
      (log.user.name && log.user.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 font-mono">
          <div className="flex items-center gap-2">
            <History className="size-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Workspace Audit Trail
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Immutable log of all team actions, member modifications, role
            changes, and security events.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-accent/30 hover:bg-accent text-xs font-mono text-foreground transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by action, user, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-mono text-xs h-9 bg-card border-border"
          />
        </div>
      </div>

      {/* Log Feed */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-2 text-xs font-mono text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span>Loading audit log entries...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-2 text-xs font-mono text-muted-foreground">
            <Shield className="size-8 text-muted-foreground/40" />
            <span className="font-bold text-foreground">
              No audit logs recorded yet
            </span>
            <span>
              Team actions, invitations, and role adjustments will appear here
              in real-time.
            </span>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent/20 transition-colors font-mono text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="size-8 rounded-full bg-accent border border-border flex items-center justify-center font-bold text-[10px] text-primary shrink-0 mt-0.5">
                    {log.user.name
                      ? log.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "OP"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">
                        {log.user.name || log.user.email}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider",
                          getActionBadge(log.action),
                        )}
                      >
                        {log.action}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        [{log.resource}]
                      </span>
                    </div>

                    {log.metadata && (
                      <div className="text-[11px] text-muted-foreground/80 mt-1 font-mono truncate max-w-[500px]">
                        {JSON.stringify(log.metadata)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0 sm:text-right">
                  {log.ipAddress && (
                    <span className="px-1.5 py-0.5 rounded bg-accent/40 border border-border">
                      {log.ipAddress}
                    </span>
                  )}
                  <span title={new Date(log.createdAt).toLocaleString()}>
                    {timeAgo(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
