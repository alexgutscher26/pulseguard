import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCALAR_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SteadyStack API Reference</title>
    <meta
      name="description"
      content="Interactive reference for the SteadyStack REST API — monitors, status pages, badges, feeds, and CI/CD gates."
    />
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.28.5"></script>
    <script>
      Scalar.createApiReference("#app", {
        spec: { url: "/docs/api/openapi.json" },
        pageTitle: "SteadyStack API",
        defaultHttpClient: { targetKey: "fetch" },
        hideModels: false,
        showSidebar: true,
      });
    </script>
  </body>
</html>`;

export async function GET() {
  return new NextResponse(SCALAR_HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
