import { createRouteHandler } from "uploadthing/next";
import { env } from "@pulseguard/env/server";
import { ourFileRouter } from "./core";

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  config: {
    callbackUrl: `${env.BETTER_AUTH_URL}/api/uploadthing`,
  },
});
