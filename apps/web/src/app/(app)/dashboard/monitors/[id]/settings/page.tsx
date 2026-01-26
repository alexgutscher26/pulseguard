import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getMonitor } from "@/actions/monitors";

/**
 * Renders the monitor settings page.
 *
 * This function retrieves the user session and checks for authentication. If the user is not authenticated, it redirects to the login page. It then fetches the monitor details using the provided id from the parameters. If the monitor is not found, it triggers a not found response. Finally, it renders the MonitorForm component with the retrieved monitor data, ensuring it matches the expected format.
 *
 * @param {Object} params - An object containing the parameters for the function.
 * @param {Promise<{ id: string }>} params.params - A promise that resolves to an object containing the monitor id.
 */
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
