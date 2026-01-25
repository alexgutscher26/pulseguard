"use client";

import { Filter, ArrowUpDown, BarChart2, Edit2 } from "lucide-react";

// Mock data
const monitors = [
  {
    name: "Main Website",
    url: "https://example.com",
    status: "Up",
    uptime: 100,
    response: "124ms",
    history: [1, 1, 1, 1, 1, 1, 0.5], // 1=green, 0=red, 0.5=opacity/older
  },
  {
    name: "API Gateway",
    url: "https://api.example.com",
    status: "Down",
    uptime: 95.2,
    response: "Timeout",
    history: [1, 1, 0, 0, 1, 1, 0.5],
  },
  {
    name: "Staging Env",
    url: "https://staging.example.com",
    status: "Paused",
    uptime: 0,
    response: "—",
    history: [-1, -1, -1, -1, -1, -1, 0.5], // -1=grey/paused
  },
];

/**
 * Renders a visual representation of uptime status as a bar.
 *
 * The function determines the color and opacity of the bar based on the provided status.
 * It uses specific color classes for different status values: green for normal, red for failure,
 * and grey for unknown. Additionally, it handles a special case for a status of 0.5 to render
 * a bar with reduced opacity.
 *
 * @param {Object} param0 - The parameters object.
 * @param {number} param0.status - The uptime status value that influences the bar's appearance.
 */
function UptimeBar({ status }: { status: number }) {
  let colorClass = "bg-[#0bda5e]"; // Green
  if (status === 0) colorClass = "bg-[#fa6238]"; // Red
  if (status === -1) colorClass = "bg-[#3b4554]"; // Grey

  const opacityClass = status === 0.5 ? "opacity-50" : "";
  // 0.5 hack for the last bar opacity in code.html, simplifying here
  if (status === 0.5) return <div className="h-4 w-1 bg-[#0bda5e] rounded-full opacity-50"></div>;

  return <div className={`h-4 w-1 rounded-full ${colorClass} ${opacityClass}`}></div>;
}

/**
 * Renders a table displaying the status of monitors.
 *
 * The MonitorsTable function creates a structured layout that includes a header with filter and sort buttons,
 * a table with monitor details such as site name, status, uptime, and response time,
 * and a footer for pagination. It utilizes the monitors data to dynamically populate the table rows
 * and displays the status of each monitor with appropriate styling based on their state.
 */
export function MonitorsTable() {
  return (
    <div>
      {/* SectionHeader */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">Your Monitors</h2>
        <div className="flex gap-2">
          <button className="bg-primary/10 text-primary text-[10px] font-bold font-mono px-3 py-1.5 rounded-sm hover:bg-primary/20 transition-colors flex items-center gap-1 uppercase tracking-wider border border-primary/20">
            <Filter className="size-3" />
            Filter
          </button>
          <button className="bg-primary/10 text-primary text-[10px] font-bold font-mono px-3 py-1.5 rounded-sm hover:bg-primary/20 transition-colors flex items-center gap-1 uppercase tracking-wider border border-primary/20">
            <ArrowUpDown className="size-3" />
            Sort
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-primary/20 bg-black/40 backdrop-blur-sm overflow-hidden shadow-lg relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Site Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">24h Uptime</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">Response</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {monitors.map((site) => (
                <tr key={site.name} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground font-mono">{site.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{site.url}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {site.status === "Up" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Up
                      </span>
                    )}
                    {site.status === "Down" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                        Down
                      </span>
                    )}
                    {site.status === "Paused" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-gray-500"></span>
                        Paused
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {site.history.map((val, i) => (
                          <UptimeBar key={i} status={val} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-foreground font-mono tracking-tight">{site.uptime > 0 ? `${site.uptime}%` : "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm font-mono font-bold ${
                        site.response === "Timeout" ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {site.response}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-primary/50">
                      <button className="hover:text-primary transition-colors">
                        <BarChart2 className="size-4" />
                      </button>
                      <button className="hover:text-primary transition-colors">
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-t border-primary/20">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Showing 1-3 of 12 monitors</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/50 text-[10px] uppercase font-mono tracking-wider disabled:opacity-30 disabled:hover:text-muted-foreground transition-all"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/50 text-[10px] uppercase font-mono tracking-wider transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
