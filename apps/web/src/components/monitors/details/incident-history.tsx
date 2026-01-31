import {
  CheckCircle,
  AlertTriangle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function IncidentHistory({ monitor }: { monitor: any }) {
  const events = monitor.events || [];
  const history = events;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /**
   * Sets the current page to a valid page number within the range.
   */
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  /**
   * Exports event history to a CSV file.
   */
  const exportToCSV = () => {
    const headers = ["Status", "Timestamp", "Latency"];
    const rows = history.map((event: any) => [
      event.status,
      new Date(event.timestamp).toISOString(),
      event.latency ? `${event.latency}ms` : "0",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `monitor_events_${monitor.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm shadow-sm relative overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h3 className="text-foreground text-lg font-bold font-mono uppercase tracking-tight">
            Event Log
          </h3>
          <p className="text-muted-foreground/60 text-xs font-mono">
            Recent heartbeat activity
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-primary/20 hover:border-primary/50 transition-colors font-mono"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/20 bg-primary/5">
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Status
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Timestamp
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Latency
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono text-right">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {paginatedHistory.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-muted-foreground/40 font-mono text-xs uppercase tracking-widest"
                >
                  No events recorded. Output stream silent.
                </td>
              </tr>
            )}
            {paginatedHistory.map((event: any) => (
              <tr
                key={event.id}
                className="hover:bg-primary/5 transition-colors group font-mono"
              >
                <td className="py-4 px-4">
                  {event.status === "UP" ? (
                    <span className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <CheckCircle className="size-4" />
                      Operational
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="size-4" />
                      Downtime
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-xs text-foreground/80">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-xs font-bold text-foreground">
                  {event.latency ? `${event.latency}ms` : "Timeout"}
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-primary hover:text-primary-foreground hover:bg-primary p-1 px-2 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-2">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                ),
              )}
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
  );
}
