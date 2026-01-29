import "@pulseguard/env/web";
import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error - specific property for Next.js 14+ dev server
  allowedDevOrigins: ["localhost:3000", "introverted-history.outray.app"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
