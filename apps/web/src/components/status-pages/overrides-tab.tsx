"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createStatusPageOverride,
  deleteStatusPageOverride,
  getStatusPageOverrides,
} from "@/actions/status-pages";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface OverridesTabProps {
  page: any;
}

const statusOptions = [
  {
    value: "OPERATIONAL",
    label: "Operational",
    color: "text-primary border-primary/20 bg-primary/10",
    icon: CheckCircle2,
  },
  {
    value: "DEGRADED",
    label: "Degraded Performance",
    color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
    icon: AlertTriangle,
  },
  {
    value: "PARTIAL_OUTAGE",
    label: "Partial Outage",
    color: "text-amber-500 border-amber-500/20 bg-amber-500/10",
    icon: AlertTriangle,
  },
  {
    value: "MAJOR_OUTAGE",
    label: "Major Outage",
    color: "text-red-500 border-red-500/20 bg-red-500/10",
    icon: ShieldAlert,
  },
  {
    value: "MAINTENANCE",
    label: "Under Maintenance",
    color: "text-orange-500 border-orange-500/20 bg-orange-500/10",
    icon: Clock,
  },
];

export function OverridesTab({ page }: OverridesTabProps) {
  const [overrides, setOverrides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedMonitorId, setSelectedMonitorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("OPERATIONAL");
  const [message, setMessage] = useState("");

  const loadOverrides = async () => {
    setLoading(true);
    try {
      const data = await getStatusPageOverrides(page.id);
      setOverrides(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load overrides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverrides();
  }, [page.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonitorId) {
      toast.error("Please select a monitor");
      return;
    }

    startTransition(async () => {
      const res = await createStatusPageOverride(page.id, selectedMonitorId, date, status, message);
      if (res.success) {
        toast.success("Manual override saved");
        setMessage("");
        loadOverrides();
      } else {
        toast.error(res.error || "Failed to save manual override");
      }
    });
  };

  const handleDelete = (overrideId: string) => {
    if (!confirm("Are you sure you want to delete this override?")) return;
    startTransition(async () => {
      const res = await deleteStatusPageOverride(page.id, overrideId);
      if (res.success) {
        toast.success("Override deleted");
        loadOverrides();
      } else {
        toast.error(res.error || "Failed to delete override");
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Creation form */}
      <div className="lg:col-span-1 border border-primary/20 bg-primary/5 rounded-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold font-mono uppercase text-foreground flex items-center gap-2">
            <Plus className="size-5 text-primary" /> Create Override
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Override the status of a specific monitor for a day.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Monitor
            </label>
            <select
              value={selectedMonitorId}
              onChange={(e) => setSelectedMonitorId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-2.5 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
              required
            >
              <option value="">Select a monitor...</option>
              {page.monitors.map((m: any) => (
                <option key={m.monitor.id} value={m.monitor.id}>
                  {m.displayName || m.monitor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Calendar className="size-3 text-primary" /> Target Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-2.5 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Override Status
            </label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-sm border transition-all text-left text-xs font-mono font-bold uppercase ${
                      isSelected
                        ? opt.color + " border-current shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        : "border-white/5 bg-black/20 text-muted-foreground hover:border-white/10 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
              Reason / Public Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Scheduled maintenance downtime, server configuration issue, etc."
              rows={3}
              className="w-full bg-black/50 border border-white/10 p-2.5 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold font-mono text-xs uppercase py-3 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            {isPending && <Loader2 className="size-3 animate-spin" />}
            Save Override
          </button>
        </form>
      </div>

      {/* List of existing overrides */}
      <div className="lg:col-span-2 border border-white/10 rounded-sm p-6 bg-[#0A0A0A] space-y-6">
        <div>
          <h2 className="text-lg font-bold font-mono uppercase text-foreground">
            Active Overrides
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Currently configured manual status overrides.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : overrides.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-mono text-sm border border-dashed border-white/5 rounded-sm bg-black/20">
            No active manual overrides found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 font-bold">Monitor</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Overridden Status</th>
                  <th className="pb-3 font-bold">Message</th>
                  <th className="pb-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {overrides.map((override) => {
                  const opt = statusOptions.find((o) => o.value === override.status);
                  const Icon = opt?.icon || AlertTriangle;
                  return (
                    <tr key={override.id} className="group hover:bg-white/[0.01]">
                      <td className="py-4 pr-3 font-bold text-foreground">
                        {override.monitor.name}
                      </td>
                      <td className="py-4 pr-3 text-muted-foreground">
                        {new Date(override.date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                      </td>
                      <td className="py-4 pr-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide ${opt?.color || ""}`}
                        >
                          <Icon className="size-3" />
                          {opt?.label || override.status}
                        </span>
                      </td>
                      <td
                        className="py-4 pr-3 text-muted-foreground max-w-[200px] truncate"
                        title={override.message}
                      >
                        {override.message || <span className="italic opacity-50">No message</span>}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(override.id)}
                          disabled={isPending}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
