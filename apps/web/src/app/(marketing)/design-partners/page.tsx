import type { Metadata } from "next";
import DesignPartnerClient from "./design-partner-client";
import { getDesignPartnerSpots } from "@/actions/design-partners";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Partner Program — 1-Year Free Netrunner Pro ($228 Value) | PulseGuard",
  description:
    "Join the exclusive PulseGuard Design Partner Program. Get 1 year of unrestricted Netrunner Pro ($228 value) free with 250 monitors, 30s checks across 350+ Cloudflare edge PoPs, multi-channel alerts, and direct founder channel access.",
  openGraph: {
    title: "Design Partner Program — 1-Year Free Netrunner Pro ($228 Value) | PulseGuard",
    description:
      "Join the exclusive PulseGuard Design Partner Program. 250 monitors, 30s multi-region edge verification, custom status pages, and private founder access for 15 engineering teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseGuard Design Partner Program — 1-Year Free Netrunner Pro",
    description:
      "Claim 1 year of free Netrunner Pro ($228 value) for your engineering team. 15 spots available.",
  },
};

export default async function DesignPartnersPage() {
  const spotsInfo = await getDesignPartnerSpots();
  return <DesignPartnerClient initialSpotsInfo={spotsInfo} />;
}
