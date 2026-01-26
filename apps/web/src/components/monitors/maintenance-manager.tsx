"use client";

import { useActionState, useState, useEffect } from "react";
import {
  createMaintenanceWindow,
  deleteMaintenanceWindow,
} from "@/actions/maintenance";
import { toast } from "sonner";
import { Loader2, Plus, Calendar, Trash2, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

interface MaintenanceWindow {
  id: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
}

const initialState = {
  success: false,
  error: "",
};

export function MaintenanceManager({
  monitorId,
  windows,
}: {
  monitorId: string;
  windows: MaintenanceWindow[];
}) {
  const [state, formAction, isPending] = useActionState(
    createMaintenanceWindow,
    initialState,
  );
  const router = useRouter();

  // Reset form on success? Controlled inputs needed.
  const [description, setDescription] = useState("");
  // Default start to next hour
  // Default start to next hour (Local Time)
  const defaultStart = new Date();
  defaultStart.setMinutes(0, 0, 0);
  defaultStart.setHours(defaultStart.getHours() + 1);

  // Adjust for timezone offset to get local ISO string
  /**
   * Converts a Date object to a local ISO string format.
   */
  const toLocalISO = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localTime = new Date(date.getTime() - tzOffset);
    return localTime.toISOString().slice(0, 16);
  };

  const [startAt, setStartAt] = useState(toLocalISO(defaultStart));

  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(defaultEnd.getHours() + 1);
  const [endAt, setEndAt] = useState(toLocalISO(defaultEnd));

  useEffect(() => {
    if (state.success) {
      toast.success("Maintenance window scheduled");
      setDescription("");
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleDelete = async (id: string) => {
    const res = await deleteMaintenanceWindow(id);
    if (res.success) {
      toast.success("Maintenance window removed");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const activeWindows = windows.filter((w) => new Date(w.endAt) > new Date());
  const pastWindows = windows.filter((w) => new Date(w.endAt) <= new Date());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-foreground font-mono uppercase tracking-tight flex items-center gap-2">
          <Construction className="size-5 text-amber-500" />
          Scheduled Maintenance
        </h3>
        <p className="text-sm text-primary/60 font-mono">
          Schedule downtime windows where alerts are suppressed.
        </p>
      </div>

      <form
        action={formAction}
        className="bg-black/40 border border-amber-500/20 p-6 backdrop-blur-sm relative group"
      >
        <input type="hidden" name="monitorId" value={monitorId} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest font-mono">
              Description
            </label>
            <input
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/50 border border-amber-500/20 focus:border-amber-500/60 text-primary text-sm rounded-sm p-3 font-mono placeholder:text-primary/20 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all w-full"
              type="text"
              placeholder="e.g. Weekly Server Patching"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest font-mono">
                Start Time
              </label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 size-4 text-amber-500/40 pointer-events-none" />
                <input
                  type="datetime-local"
                  name="startAt"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="bg-black/50 border border-amber-500/20 focus:border-amber-500/60 text-primary text-sm rounded-sm p-3 pl-10 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all w-full calendar-picker-indicator:invert"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest font-mono">
                End Time
              </label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 size-4 text-amber-500/40 pointer-events-none" />
                <input
                  type="datetime-local"
                  name="endAt"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="bg-black/50 border border-amber-500/20 focus:border-amber-500/60 text-primary text-sm rounded-sm p-3 pl-10 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all w-full calendar-picker-indicator:invert"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Schedule Window
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-primary/50 uppercase tracking-widest font-mono border-b border-primary/10 pb-2">
          Upcoming Windows
        </h4>
        {activeWindows.length === 0 ? (
          <p className="text-sm text-primary/30 font-mono italic">
            No upcoming maintenance scheduled.
          </p>
        ) : (
          <div className="space-y-2">
            {activeWindows.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 hover:border-amber-500/30 transition-colors group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-primary font-mono">
                    {w.description || "Unscheduled Maintenance"}
                  </span>
                  <span className="text-xs text-primary/50 font-mono flex gap-2">
                    <span>{new Date(w.startAt).toLocaleString()}</span>
                    <span>→</span>
                    <span>{new Date(w.endAt).toLocaleString()}</span>
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="p-2 text-primary/30 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
