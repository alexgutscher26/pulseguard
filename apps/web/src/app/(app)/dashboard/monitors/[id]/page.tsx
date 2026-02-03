import { notFound } from "next/navigation";
import { getMonitor } from "@/actions/monitors";
import { MonitorDetailView } from "@/components/monitors/details/monitor-detail-view";

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const monitor = await getMonitor(id);

  if (!monitor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <MonitorDetailView initialMonitor={monitor} />
    </div>
  );
}
