import type { Metadata } from "next";
import DesignPartnerClient from "./design-partner-client";

export const metadata: Metadata = {
  title: "Design Partner Program — Free Pro Access for 1 Year | PulseGuard",
  description:
    "Apply to become a PulseGuard Design Partner. Get 1 year of Netrunner Pro ($168 value) free in exchange for real usage and launch-day feedback.",
  openGraph: {
    title: "Design Partner Program — Free Pro Access for 1 Year | PulseGuard",
    description: "Get 1 year of PulseGuard Netrunner Pro ($168 value) free.",
  },
};

export default function DesignPartnersPage() {
  return <DesignPartnerClient />;
}
