import { notFound } from "next/navigation";
import { getMonitor } from "@/actions/monitors";
import { MonitorDetailView } from "@/components/monitors/details/monitor-detail-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monitor = await getMonitor(id);

  if (!monitor) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/monitors">
            <ChevronLeft className="size-4 mr-1" />
            Back to Monitors
          </Link>
        </Button>
      </div>

      <MonitorDetailView initialMonitor={monitor} />
    </div>
  );
}
