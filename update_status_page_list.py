import re

with open("apps/web/src/components/status-pages/status-page-list.tsx", "r") as f:
    content = f.read()

import_statement = 'import { env } from "@pulseguard/env/web";\n'

# Add import if it doesn't exist
if 'import { env }' not in content:
    content = content.replace('import { useState } from "react";', import_statement + 'import { useState } from "react";')

old_func = """  const getPublicLink = (page: any) => {
    if (page.customDomain) return `https://${page.customDomain}`;

    if (typeof window !== "undefined") {
      const host = window.location.host;

      // Local development or generic path-based fallback
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        return `/status-page/${page.slug}`;
      }

      // Production subdomain strategy:
      // Replaces the "app." prefix with the page slug (e.g., app.pulseguard.cloud -> slug.pulseguard.cloud)
      // Otherwise assumes root domain and prepends slug.
      const baseDomain = host.startsWith("app.") ? host.replace("app.", "") : host;
      return `https://${page.slug}.${baseDomain}`;
    }

    return `/status-page/${page.slug}`;
  };"""

new_func = """  const getPublicLink = (page: any) => {
    if (page.customDomain) return `https://${page.customDomain}`;

    // Remove protocol for cleaner URLs if needed, but here we just need a valid href
    return `${env.NEXT_PUBLIC_APP_URL}/status-page/${page.slug}`;
  };"""

content = content.replace(old_func, new_func)

with open("apps/web/src/components/status-pages/status-page-list.tsx", "w") as f:
    f.write(content)
print("Updated successfully")
