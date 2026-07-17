"use client";

import { MoreHorizontal, Zap, WifiOff, ChevronLeft, ChevronRight, ExternalLink, Settings, Play, Pause, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toggleMonitor, checkMonitor, deleteMonitor } from "@/actions/monitors";
import { toast } from "sonner";

/**
 * Renders a status bar with a background color based on the provided status.
 *
 * The function determines the appropriate background class for the bar based on the status value.
 * It uses specific classes for different statuses: red for 0, amber for 2, and a placeholder for 3 indicating no data.
 * The bar is styled with a fixed width and height, and the title attribute is set to "No Data" when the status is 3.
 *
 * @param {Object} param0 - The parameters object.
 * @param {number} param0.status - The status code that determines the background color of the bar.
 */
function UptimeBar({ status }: { status: number }) {
  let bgClass = "bg-primary/80";
  if (status === 0) bgClass = "bg-red-500/80";
  if (status === 2) bgClass = "bg-amber-500/80";
  if (status === 3) bgClass = "bg-zinc-800/80 dark:bg-zinc-700/50"; // Placeholder for no data (more visible)

  return (
    <div
      className={`w-1 h-3 md:h-4 ${bgClass} rounded-[1px]`}
      title={status === 3 ? "No Data" : ""}
    ></div>
  );
}

/**
 * Renders a paginated list of monitors with their statuses and details.
 *
 * The function calculates the total number of pages based on the number of monitors and the items per page. It slices the monitors array to display only the current page's monitors. Each monitor's uptime is calculated based on its event history, and the component provides navigation for pagination. The UI displays the status, monitor information, history, and response time for each monitor.
 *
 * @param {Object} param0 - The parameters object.
 * @param {any[]} param0.monitors - An array of monitor objects to be displayed.
 * @returns {JSX.Element} The rendered component displaying the list of monitors.
 */
export function MonitorList({ monitors }: { monitors: any[] }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isChecking, setIsChecking] = useState<Record<string, boolean>>({});
  const [isToggling, setIsToggling] = useState<Record<string, boolean>>({});
  const [deleteMonitorId, setDeleteMonitorId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const monitorToDelete = deleteMonitorId ? monitors.find((m) => m.id === deleteMonitorId) : null;

  const handleCheckNow = async (e: React.MouseEvent, monitorId: string, name: string) => {
    e.stopPropagation();
    setIsChecking((prev) => ({ ...prev, [monitorId]: true }));
    const toastId = toast.loading(`Triggering check for ${name}...`);
    try {
      const res = await checkMonitor(monitorId, {
        checkRegions: ["Dashboard Manual Action"],
        reason: "User manually requested check",
      });
      if (res.success) {
        toast.success(`Check completed for ${name}`, { id: toastId });
      } else {
        toast.error(res.error || `Failed to trigger check for ${name}`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsChecking((prev) => ({ ...prev, [monitorId]: false }));
    }
  };

  const handleToggle = async (e: React.MouseEvent, monitorId: string, name: string, currentStatus: string) => {
    e.stopPropagation();
    setIsToggling((prev) => ({ ...prev, [monitorId]: true }));
    const nextEnabled = currentStatus === "PAUSED";
    const toastId = toast.loading(`${nextEnabled ? "Resuming" : "Pausing"} ${name}...`);
    try {
      const res = await toggleMonitor(monitorId, nextEnabled);
      if (res.success) {
        toast.success(`${name} ${nextEnabled ? "resumed" : "paused"} successfully`, { id: toastId });
      } else {
        toast.error(res.error || `Failed to toggle ${name}`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsToggling((prev) => ({ ...prev, [monitorId]: false }));
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, monitorId: string) => {
    e.stopPropagation();
    setDeleteMonitorId(monitorId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMonitorId) return;
    setIsDeleting(true);
    const monitor = monitors.find((m) => m.id === deleteMonitorId);
    const name = monitor?.name || "Monitor";
    const toastId = toast.loading(`Deleting ${name}...`);
    try {
      const res = await deleteMonitor(deleteMonitorId);
      if (res.success) {
        toast.success(`${name} deleted successfully`, { id: toastId });
        setDeleteMonitorId(null);
      } else {
        toast.error(res.error || `Failed to delete ${name}`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(monitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMonitors = monitors.slice(startIndex, startIndex + itemsPerPage);

  const getUptime = (events: any[]) => {
    if (!events || events.length === 0) return 0;
    // Consider both UP and MAINTENANCE as "not down" for success rate,
    // or strictly UP? Usually Maintenance doesn't count against uptime.
    // Let's stick to UP count / total count for now, or total - down / total.
    const downCount = events.filter((e) => e.status === "DOWN").length;
    return Math.round(((events.length - downCount) / events.length) * 100);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="border border-primary/20 bg-card/40 relative overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Decor corners */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 pointer-events-none"></div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary/5 border-b border-primary/20">
            <tr>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                Status
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                Monitor Info
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                History (Latest)
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                Response
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 text-sm">
            {monitors.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-primary/40 font-mono text-xs uppercase tracking-widest"
                >
                  No monitors active. Dispatch new targets.
                </td>
              </tr>
            ) : (
              currentMonitors.map((monitor) => {
                // Calculate history for bars (last 20 events reversed for display left-to-right?)
                // Assuming events are desc, so [0] is latest. We take the first 20.
                const recentEvents = monitor.events ? monitor.events.slice(0, 20) : [];

                // Map events to status codes
                const rawHistory = [...recentEvents].reverse().map((e: any) => {
                  if (e.status === "MAINTENANCE") return 2;
                  return e.status === "UP" ? 1 : 0;
                });

                // Pad with "empty" slots (3) to ensure 20 bars
                const history = Array(20).fill(3);
                // Fill the end of the array with the actual history
                // We want [empty, empty, ..., old, new]
                const startIndex = 20 - rawHistory.length;
                rawHistory.forEach((status, index) => {
                  if (startIndex + index < 20) {
                    history[startIndex + index] = status;
                  }
                });

                const latestLatency = monitor.events?.[0]?.latency;
                const uptime = getUptime(monitor.events);

                return (
                  <tr
                    key={monitor.id}
                    onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}
                    className="group hover:bg-primary/5 transition-colors cursor-pointer font-mono border-l-2 border-transparent hover:border-primary/50"
                  >
                    <td className="p-4 w-32">
                      {monitor.status === "UP" && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/20 w-fit rounded-sm">
                          <div className="size-1.5 bg-primary rounded-full shadow-[0_0_5px_currentColor] animate-pulse"></div>
                          <span className="text-[10px] uppercase text-primary font-bold tracking-wider">
                            UP
                          </span>
                        </div>
                      )}
                      {monitor.status === "DOWN" && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 w-fit rounded-sm">
                          <div className="size-1.5 bg-red-500 rounded-full shadow-[0_0_5px_currentColor] animate-ping"></div>
                          <span className="text-[10px] uppercase text-red-500 font-bold tracking-wider">
                            DOWN
                          </span>
                        </div>
                      )}
                      {monitor.status === "PAUSED" && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 w-fit rounded-sm">
                          <div className="size-1.5 bg-yellow-500 rounded-full"></div>
                          <span className="text-[10px] uppercase text-yellow-500 font-bold tracking-wider">
                            PAUSED
                          </span>
                        </div>
                      )}
                      {monitor.status === "MAINTENANCE" && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 w-fit rounded-sm">
                          <div className="size-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] uppercase text-amber-500 font-bold tracking-wider">
                            MAINT
                          </span>
                        </div>
                      )}
                    </td>
                    <td className={`p-4 ${monitor.status === "PAUSED" ? "opacity-75" : ""}`}>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-foreground group-hover:text-primary transition-colors ${monitor.status === "DOWN" ? "group-hover:text-red-500" : monitor.status === "PAUSED" ? "group-hover:text-yellow-500" : ""}`}
                        >
                          {monitor.name}
                        </span>
                        <span className="text-[10px] text-primary/50 mt-0.5 font-sans break-all">
                          {monitor.type === "HEARTBEAT" ? "Heartbeat Monitor" : monitor.url}
                        </span>
                        {monitor.tags && monitor.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {monitor.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider bg-primary/5 border border-primary/25 text-primary/60 rounded-xs uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`p-4 ${monitor.status === "PAUSED" ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-px h-4 items-end">
                          {history.map((h: number, i: number) => (
                            <UptimeBar key={i} status={h} />
                          ))}
                        </div>
                        <span
                          className={`text-xs font-bold ${uptime < 100 ? "text-red-500" : "text-primary"}`}
                        >
                          {uptime}%
                        </span>
                      </div>
                    </td>
                    <td className={`p-4 ${monitor.status === "PAUSED" ? "opacity-50" : ""}`}>
                      {monitor.status !== "PAUSED" ? (
                        <div className="flex items-center gap-2 text-xs">
                          {monitor.status === "DOWN" ? (
                            <WifiOff className="size-3 text-red-500" />
                          ) : (
                            <Zap className="size-3 text-primary" />
                          )}
                          <span
                            className={
                              monitor.status === "DOWN" ? "text-red-500" : "text-foreground"
                            }
                          >
                            {latestLatency ? latestLatency + "ms" : "--"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-primary/20 text-primary/50 hover:text-primary transition-colors rounded-sm cursor-pointer outline-none"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none border-primary/20 bg-background/95 backdrop-blur-md min-w-[140px] font-mono">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/monitors/${monitor.id}`);
                            }}
                            className="cursor-pointer"
                          >
                            <ExternalLink className="size-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/monitors/${monitor.id}/settings`);
                            }}
                            className="cursor-pointer"
                          >
                            <Settings className="size-3.5 mr-2" />
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-primary/10" />
                          <DropdownMenuItem
                            onClick={(e) => handleCheckNow(e, monitor.id, monitor.name)}
                            disabled={monitor.status === "PAUSED" || isChecking[monitor.id]}
                            className="cursor-pointer"
                          >
                            {isChecking[monitor.id] ? (
                              <Loader2 className="size-3.5 mr-2 animate-spin text-primary" />
                            ) : (
                              <Play className="size-3.5 mr-2 text-primary" />
                            )}
                            Run Check
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleToggle(e, monitor.id, monitor.name, monitor.status)}
                            disabled={isToggling[monitor.id]}
                            className="cursor-pointer"
                          >
                            {isToggling[monitor.id] ? (
                              <Loader2 className="size-3.5 mr-2 animate-spin text-primary" />
                            ) : monitor.status === "PAUSED" ? (
                              <Play className="size-3.5 mr-2 text-primary" />
                            ) : (
                              <Pause className="size-3.5 mr-2 text-yellow-500" />
                            )}
                            {monitor.status === "PAUSED" ? "Resume" : "Pause"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-primary/10" />
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteClick(e, monitor.id)}
                            variant="destructive"
                            className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
                          >
                            <Trash2 className="size-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-primary/20 flex items-center justify-between bg-primary/5">
        <span className="text-[10px] text-primary/60 uppercase tracking-widest font-mono">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, monitors.length)} of{" "}
          {monitors.length} targets
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-[10px] uppercase font-bold tracking-wider disabled:opacity-30 disabled:hover:text-primary/60 flex items-center gap-1 font-mono transition-all rounded-sm"
          >
            <ChevronLeft className="size-3" /> Prev
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-[10px] uppercase font-bold tracking-wider disabled:opacity-30 disabled:hover:text-primary/60 flex items-center gap-1 font-mono transition-all rounded-sm"
          >
            Next <ChevronRight className="size-3" />
          </button>
        </div>
      </div>
      </div>

      <Dialog open={deleteMonitorId !== null} onOpenChange={(open) => !open && setDeleteMonitorId(null)}>
        <DialogContent className="rounded-none border-primary/20 bg-card/95 backdrop-blur-md max-w-md font-mono text-foreground">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
              <Trash2 className="size-4" /> Decommission Target
            </DialogTitle>
            <DialogDescription className="text-xs text-primary/60 mt-2 font-mono">
              Are you sure you want to permanently delete monitor <span className="text-foreground font-bold">{monitorToDelete?.name}</span>? This action is irreversible and will erase all telemetry history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <button
              onClick={() => setDeleteMonitorId(null)}
              className="px-3 py-2 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-[10px] uppercase font-bold tracking-wider transition-all rounded-sm cursor-pointer"
            >
              Abort Mission
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500 text-[10px] uppercase font-bold tracking-wider transition-all rounded-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="size-3 animate-spin" /> : null}
              Confirm Destruction
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
