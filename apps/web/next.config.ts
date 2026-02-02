import "@pulseguard/env/web";
import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    "localhost:3000",
    ...(process.env.ALLOWED_DEV_ORIGINS?.split(",") || []),
  ],
};

export default nextConfig;

initOpenNextCloudflareForDev();
