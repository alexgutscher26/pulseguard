import type { Metadata } from "next";
import { CLOUDFLARE_PROBE_REGIONS } from "@pulseguard/shared";
import LocationsClient from "./locations-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Every place we check from — Public Probe Locations | PulseGuard",
  description:
    "Live status of all seven probe regions, the networks they run on, and the IP ranges to allowlist. Updated continuously. If a probe is unhealthy, you'll see it here before it can affect your alerts.",
  openGraph: {
    title: "Every place we check from — PulseGuard",
    description:
      "Live status of all seven probe regions, the networks they run on, and the IP ranges to allowlist.",
    type: "website",
  },
};

export default function LocationsPage() {
  const probes = CLOUDFLARE_PROBE_REGIONS.map((region) => ({
    ...region,
    status: region.defaultHealthStatus || "ONLINE",
    currentLatency: 18,
    measuredColo: region.primaryColos[0] || "GLOBAL",
    lastCheck: "Just now",
  }));

  return <LocationsClient probes={probes} />;
}
