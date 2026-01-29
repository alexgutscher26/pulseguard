import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
 
// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
 
  config: { 
    callbackUrl: "https://dark-space.outray.app/api/uploadthing", 
  },
});
