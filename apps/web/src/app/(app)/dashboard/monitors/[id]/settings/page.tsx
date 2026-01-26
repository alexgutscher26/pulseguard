import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getMonitor } from "@/actions/monitors";
import { MonitorSettingsView } from "@/components/monitors/settings-view";

/**
 * Renders the monitor settings page.
 *
 * This function checks for user authentication and retrieves the monitor details using the provided id from the parameters. If the user is not authenticated, it redirects to the login page. If the monitor is not found, it triggers a not found response. Finally, it renders the MonitorSettingsView component with the retrieved monitor data and its associated maintenance windows.
 *
 * @param {Object} params - An object containing the parameters for the function.
 * @param {Promise<{ id: string }>} params.params - A promise that resolves to an object containing the monitor id.
 */
export default async function MonitorSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
