import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileForm } from "@/components/settings/profile-form";
import { RegionalForm } from "@/components/settings/regional-form";
import { DangerZone } from "@/components/settings/danger-zone";
import { SecurityForm } from "@/components/settings/security-form";
import { ApiKeysForm } from "@/components/settings/api-keys-form";

/**
 * Renders the settings page based on the user's session and selected tab.
 *
 * This function retrieves the current user session and checks if the user is authenticated.
 * It then determines which settings tab to display, defaulting to "general" if none is specified.
 * Depending on the selected tab, it renders the appropriate settings components, including
 * profile, regional settings, security, and API keys forms.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ tab?: string }>} params.searchParams - A promise that resolves to an object containing the selected tab.
 */
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
