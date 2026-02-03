import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MonitorForm } from "@/components/monitors/monitor-form";

export default async function NewMonitorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center p-6">
      <MonitorForm />
    </div>
  );
}
