"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatusPageAnalytics } from "@/actions/analytics";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Loader2 } from "lucide-react";

export function TrafficChart({ pageId }: { pageId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["status-analytics", pageId],
    queryFn: async () => getStatusPageAnalytics(pageId, 30),
  });

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  if (!data?.chartData || data.chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-sm bg-white/5">
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
          No Traffic Data
        </p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.chartData}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000",
              border: "1px solid #333",
              color: "#fff",
            }}
            itemStyle={{ fontSize: "12px", fontFamily: "monospace" }}
            labelStyle={{
              marginBottom: "5px",
              color: "#888",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            name="Total Views"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorViews)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="uniqueVisitors"
            name="Unique Visitors"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorUniques)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
