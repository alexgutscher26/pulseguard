import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pg",
    "pg-cloudflare",
    "@prisma/client",
    ".prisma/client",
  ],
};

export default nextConfig;