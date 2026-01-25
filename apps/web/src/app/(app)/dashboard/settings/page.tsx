import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileForm } from "@/components/settings/profile-form";
import { RegionalForm } from "@/components/settings/regional-form";
import { DangerZone } from "@/components/settings/danger-zone";
import { SecurityForm } from "@/components/settings/security-form";
import { ApiKeysForm } from "@/components/settings/api-keys-form";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { tab = "general" } = await searchParams;

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
      <SettingsSidebar />
      <div className="flex-1 flex flex-col gap-6">
        {tab === "general" && (
            <>
                <ProfileForm />
                <RegionalForm />
                <DangerZone />
            </>
        )}
        {tab === "security" && <SecurityForm />}
        {tab === "api-keys" && <ApiKeysForm />}
      </div>
    </div>
  );
}
