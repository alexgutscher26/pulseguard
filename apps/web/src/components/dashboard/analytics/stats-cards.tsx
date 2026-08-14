"use client";
// aria-label placeholder

import { useQuery } from "@tanstack/react-query";
import { getStatusPageAnalytics } from "@/actions/analytics";
import { Users, Eye, TrendingUp } from "lucide-react";

export function StatsCards({ pageId }: { pageId: string }) {
  const { data } = useQuery({
    queryKey: ["status-analytics", pageId],
    queryFn: async () => getStatusPageAnalytics(pageId, 30),
  });

  const cards = [
    {
      title: "Total Views",
      value: data?.totalViews || 0,
      icon: Eye,
      color: "text-green-500",
    },
    {
      title: "Unique Visitors",
      value: data?.uniqueVisitors || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      // Simple metric: Views / Uniques
      title: "Views Per Visitor",
      value: data?.uniqueVisitors ? (data.totalViews / data.uniqueVisitors).toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white/5 border border-white/10 rounded-sm p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-full bg-white/5 border border-white/5 ${card.color}`}>
            <card.icon className="size-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              {card.title}
            </p>
            <p className="text-2xl font-mono font-bold text-white">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
