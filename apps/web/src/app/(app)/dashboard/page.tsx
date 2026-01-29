import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Dashboard from "./dashboard";

import { getMonitors, getDashboardStats } from "@/actions/monitors";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [monitors, stats] = await Promise.all([
    getMonitors(),
    getDashboardStats(),
  ]);

  return <Dashboard monitors={monitors} stats={stats} />;
}
