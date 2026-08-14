import type { Metadata } from "next";
import { CLOUDFLARE_PROBE_REGIONS } from "@pulseguard/shared";
import LocationsClient from "./locations-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Global Probe Locations & WAF Allowlist — Zero False Positives | PulseGuard",
  description:
    "Explore PulseGuard's 7 sovereign Cloudflare edge probe regions, live data center POP telemetry, ASNs, and machine-readable IPv4/IPv6 CIDR ranges for firewall allowlisting.",
  openGraph: {
    title: "Global Probe Locations & WAF Allowlist — PulseGuard",
    description:
      "Explore PulseGuard's 7 sovereign Cloudflare edge probe regions, live POP telemetry, ASNs, and machine-readable IP ranges.",
    type: "website",
  },
};

export default function LocationsPage() {
  const probes = CLOUDFLARE_PROBE_REGIONS.map((region) => ({
    ...region,
    status: region.defaultHealthStatus || "ONLINE",
    currentLatency: 18,
    measuredColo: region.primaryColos[0] || "GLOBAL",
  }));

  return <LocationsClient probes={probes} />;
}
