import { notFound, redirect } from "next/navigation";
import { getMonitor } from "@/actions/monitors";
import { MonitorSettingsView } from "@/components/monitors/settings-view";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

/**
 * Renders the monitor settings page.
 *
 * This function retrieves the user session and checks for authentication. If the user is not authenticated, it redirects to the login page. It then fetches the monitor details using the provided id from the parameters. If the monitor is not found, it triggers a not found response. Finally, it renders the MonitorForm component with the retrieved monitor data, ensuring it matches the expected format.
 *
 * @param {Object} params - An object containing the parameters for the function.
 * @param {Promise<{ id: string }>} params.params - A promise that resolves to an object containing the monitor id.
 */
export default async function MonitorSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  console.log(`[Debug] Fetching monitor settings for ID: ${id}`);
  
  const monitor = await getMonitor(id);

  if (!monitor) {
    console.warn(`[Debug] Monitor not found or unauthorized for ID: ${id}`);
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
