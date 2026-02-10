import { env } from "@pulseguard/env/server";
import "@pulseguard/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim()),
};

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
