export interface HeaderScanResult {
  header: string;
  status: "SECURE" | "WARNING" | "CRITICAL" | "INFO";
  value: string | null;
  description: string;
  recommendation?: string;
}

export async function checkSecurityHeaders(targetUrl: string) {
  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "PulseGuard-Security-Scanner/1.0",
      },
      redirect: "follow",
    });

    const headers = response.headers;
    const results: HeaderScanResult[] = [];
    let score = 100;

    // 1. Strict-Transport-Security (HSTS)
    const hsts = headers.get("strict-transport-security");
    if (hsts) {
      results.push({
        header: "Strict-Transport-Security",
        status: "SECURE",
        value: hsts,
        description: "Enforces secure (HTTP over SSL/TLS) connections to the server.",
      });
    } else {
      score -= 20;
      results.push({
        header: "Strict-Transport-Security",
        status: "CRITICAL",
        value: null,
        description: "HSTS header is missing. Attacks like SSL stripping can succeed.",
        recommendation:
          "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'",
      });
    }

    // 2. Content-Security-Policy (CSP)
    const csp = headers.get("content-security-policy");
    if (csp) {
      results.push({
        header: "Content-Security-Policy",
        status: "SECURE",
        value: csp.length > 50 ? csp.substring(0, 50) + "..." : csp,
        description: "Controls which resources the user agent is allowed to load.",
      });
    } else {
      score -= 25;
      results.push({
        header: "Content-Security-Policy",
        status: "CRITICAL",
        value: null,
        description: "CSP is missing. This site is vulnerable to XSS and injection attacks.",
        recommendation: "Implement a robust CSP policy to whitelist trusted sources.",
      });
    }

    // 3. X-Frame-Options
    const xfo = headers.get("x-frame-options");
    if (xfo) {
      results.push({
        header: "X-Frame-Options",
        status: "SECURE",
        value: xfo,
        description:
          "Indicates whether a browser should be allowed to render a page in a frame or iframe.",
      });
    } else {
      score -= 15;
      results.push({
        header: "X-Frame-Options",
        status: "WARNING",
        value: null,
        description: "Header is missing. Site may be vulnerable to Clickjacking.",
        recommendation: "Use 'X-Frame-Options: DENY' or 'SAMEORIGIN'.",
      });
    }

    // 4. X-Content-Type-Options
    const xcto = headers.get("x-content-type-options");
    if (xcto?.toLowerCase() === "nosniff") {
      results.push({
        header: "X-Content-Type-Options",
        status: "SECURE",
        value: xcto,
        description:
          "Prevents the browser from MIME-sniffing a response away from the declared content-type.",
      });
    } else {
      score -= 10;
      results.push({
        header: "X-Content-Type-Options",
        status: "WARNING",
        value: xcto || null,
        description:
          "MIME sniffing is not disabled. Could lead to security risks with user-uploaded content.",
        recommendation: "Set 'X-Content-Type-Options: nosniff'.",
      });
    }

    // 5. Referrer-Policy
    const rp = headers.get("referrer-policy");
    if (rp) {
      results.push({
        header: "Referrer-Policy",
        status: "SECURE",
        value: rp,
        description: "Governs which referrer information should be included with requests.",
      });
    } else {
      score -= 5;
      results.push({
        header: "Referrer-Policy",
        status: "INFO",
        value: null,
        description: "Referrer policy is not explicitly defined.",
        recommendation: "Set 'Referrer-Policy: strict-origin-when-cross-origin'.",
      });
    }

    // 6. Information Disclosure (Negative Check)
    const server = headers.get("server");
    const xpb = headers.get("x-powered-by");

    if (server) {
      score -= 5;
      results.push({
        header: "Server",
        status: "WARNING",
        value: server,
        description: "Server header discloses software version information.",
        recommendation: "Hide original server header to prevent targeted reconnaissance.",
      });
    }

    if (xpb) {
      score -= 5;
      results.push({
        header: "X-Powered-By",
        status: "WARNING",
        value: xpb,
        description: "Discloses the underlying technology (e.g., Express, PHP).",
        recommendation: "Remove this header for better security through obscurity.",
      });
    }

    // Grade calculation
    let grade = "F";
    if (score >= 90) grade = "A+";
    else if (score >= 80) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 60) grade = "C";
    else if (score >= 50) grade = "D";

    return {
      url: targetUrl,
      score: Math.max(0, score),
      grade,
      results,
      rawHeaders: Object.fromEntries(headers.entries()),
    };
  } catch (error: any) {
    throw new Error(`Failed to audit ${targetUrl}: ${error.message}`);
  }
}
