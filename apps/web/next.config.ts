import "@pulseguard/env/web";
import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // TODO: Change Later!
  allowedDevOrigins: ["localhost:3000", "loyal-canyon.outray.app"],
};

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

initOpenNextCloudflareForDev();

export default withNextIntl(nextConfig);
