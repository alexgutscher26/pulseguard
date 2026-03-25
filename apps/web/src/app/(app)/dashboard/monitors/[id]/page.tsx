import { notFound } from "next/navigation";
import { getMonitor, getMonitorInsights } from "@/actions/monitors";
import { MonitorDetailView } from "@/components/monitors/details/monitor-detail-view";
import { AIInsights } from "@/components/dashboard/ai-insights";

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [monitor, insights] = await Promise.all([getMonitor(id), getMonitorInsights(id)]);

  if (!monitor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <AIInsights insights={insights} />
      <MonitorDetailView initialMonitor={monitor} />
    </div>
  );
}
