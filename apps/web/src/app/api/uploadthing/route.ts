import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { env } from "@pulseguard/env/server";

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  config: {
    callbackUrl: `${env.BETTER_AUTH_URL}/api/uploadthing`,
  },
});
