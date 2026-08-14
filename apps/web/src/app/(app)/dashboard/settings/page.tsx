import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileForm } from "@/components/settings/profile-form";
import { RegionalForm } from "@/components/settings/regional-form";
import { DangerZone } from "@/components/settings/danger-zone";
import { SecurityForm } from "@/components/settings/security-form";
import { ApiKeysForm } from "@/components/settings/api-keys-form";
import { MigrationForm } from "@/components/settings/migration-form";
import { PrivacyForm } from "@/components/settings/privacy-form";
import { BillingForm } from "@/components/settings/billing-form";
import { ReferralForm } from "@/components/settings/referral-form";
import { getUserUsageSummary } from "@/lib/billing-server";
import { verifyAndApplyCheckoutSession } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Renders the settings page based on the user's session and selected tab.
 *
 * This function retrieves the current user session and checks if the user is authenticated.
 * It then determines which settings tab to display, defaulting to "general" if none is specified.
 * Depending on the selected tab, it renders the appropriate settings components, including
 * profile, regional settings, security, and API keys forms.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ tab?: string; session_id?: string }>} params.searchParams - Search params.
 */
export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; session_id?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const rawTab = resolvedParams.tab || "general";
  const sessionId = resolvedParams.session_id;

  // If returning from Stripe checkout with a session_id, verify and apply plan immediately!
  if (sessionId && sessionId.startsWith("cs_")) {
    await verifyAndApplyCheckoutSession({
      userId: session.user.id,
      sessionId,
    });
  }

  // Clean tab parameter in case query parameters were concatenated (e.g. "billing?session_id=...")
  const cleanTab = rawTab.split("?")[0].split("&")[0];
  const validTabs = [
    "general",
    "billing",
    "security",
    "api-keys",
    "migration",
    "privacy",
  ];
  const tab = validTabs.includes(cleanTab) ? cleanTab : "general";
  const usageSummary =
    tab === "billing" ? await getUserUsageSummary(session.user.id) : undefined;

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
        {tab === "billing" && <BillingForm initialUsage={usageSummary} />}
        {/* {tab === "referrals" && <ReferralForm />} */}
        {tab === "security" && <SecurityForm />}
        {tab === "api-keys" && <ApiKeysForm />}
        {tab === "migration" && <MigrationForm />}
        {tab === "privacy" && <PrivacyForm />}
      </div>
    </div>
  );
}
