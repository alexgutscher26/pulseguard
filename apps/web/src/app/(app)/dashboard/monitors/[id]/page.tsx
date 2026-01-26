import { notFound } from "next/navigation";
import { getMonitor } from "@/actions/monitors";
import { MonitorDetailView } from "@/components/monitors/details/monitor-detail-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
        <Link
          href="/dashboard/monitors"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground",
          )}
        >
          <ChevronLeft className="size-4 mr-1" />
          Back to Monitors
        </Link>
      </div>

      <MonitorDetailView initialMonitor={monitor} />
    </div>
  );
}
