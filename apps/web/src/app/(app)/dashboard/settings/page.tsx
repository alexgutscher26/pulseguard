import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileForm } from "@/components/settings/profile-form";
import { RegionalForm } from "@/components/settings/regional-form";
import { DangerZone } from "@/components/settings/danger-zone";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
      <SettingsSidebar />
      <div className="flex-1 flex flex-col gap-6">
        <ProfileForm />
        <RegionalForm />
        <DangerZone />
      </div>
    </div>
  );
}
