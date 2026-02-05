import "@pulseguard/env/web";
import type { NextConfig } from "next";

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

export default withNextIntl(nextConfig);
