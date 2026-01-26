import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getMonitor } from "@/actions/monitors";
import { MonitorSettingsView } from "@/components/monitors/settings-view";
export default async function MonitorSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  // ... (auth checks)
  const { id } = await params;
  const monitor = await getMonitor(id);

  if (!monitor) {
    notFound();
  }

  // Cast because prisma types might be stale in this context but runtime is correct
  const windows = (monitor as any).maintenanceWindows || [];

  return (
    <div className="flex justify-center p-6">
      <MonitorSettingsView monitor={monitor} windows={windows} />
    </div>
  );
}
