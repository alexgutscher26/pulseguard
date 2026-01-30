import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Dashboard from "./dashboard";

import { getMonitors, getDashboardStats } from "@/actions/monitors";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  console.log("Dashboard Page Session Check:", {
    hasUser: !!session?.user,
    userId: session?.user?.id,
  });

  if (!session?.user) {
    redirect("/login?source=dashboard");
  }

  const [monitors, stats] = await Promise.all([
    getMonitors(),
    getDashboardStats(),
  ]);

  return <Dashboard monitors={monitors} stats={stats} />;
}
