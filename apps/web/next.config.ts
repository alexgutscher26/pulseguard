import "@pulseguard/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: true,
  reactCompiler: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",") || [],
};

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
