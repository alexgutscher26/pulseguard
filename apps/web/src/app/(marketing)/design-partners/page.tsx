import type { Metadata } from "next";
import DesignPartnerClient from "./design-partner-client";
import { getDesignPartnerSpots } from "@/actions/design-partners";

export const metadata: Metadata = {
  title: "Design Partner Program — Free Pro Access for 1 Year | PulseGuard",
  description:
    "Apply to become a PulseGuard Design Partner. Get 1 year of Netrunner Pro ($228 value) free in exchange for real usage and launch-day feedback.",
  openGraph: {
    title: "Design Partner Program — Free Pro Access for 1 Year | PulseGuard",
    description: "Get 1 year of PulseGuard Netrunner Pro ($228 value) free.",
  },
};

export default async function DesignPartnersPage() {
  const spotsInfo = await getDesignPartnerSpots();
  return <DesignPartnerClient initialSpots={spotsInfo.remainingSpots} />;
}
