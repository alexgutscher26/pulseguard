export interface DomainExpirationResult {
  domain: string;
  expiryDate: string | null;
  daysRemaining: number;
  registrar: string | null;
  registrantName: string | null;
  statuses: string[];
  criticalStatuses: string[];
  isExpired: boolean;
  isCritical: boolean;
  grade: "A" | "B" | "C" | "D" | "F";
}

const CRITICAL_STATUSES = new Set([
  "server hold",
  "serverHold",
  "client hold",
  "clientHold",
  "pending delete",
  "pendingDelete",
  "pending transfer",
  "pendingTransfer",
  "redemption period",
  "redemptionPeriod",
  "pending restoration",
  "pendingRestoration",
  "auto renew period",
  "autoRenewPeriod",
  "inactive",
  "expired",
]);

function extractHostname(domain: string): string {
  return (domain.replace(/^https?:\/\//, "").split("/")[0] || "").split(":")[0] || domain;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function checkDomainExpiration(domain: string): Promise<DomainExpirationResult> {
  const hostname = extractHostname(domain);

  let rdapData: any = null;
  let fallbackUsed = false;

  // Try RDAP lookup via rdap.org
  try {
    const response = await fetch(`https://rdap.org/domain/${hostname}`, {
      headers: {
        Accept: "application/rdap+json",
        "User-Agent": "PulseGuard-Domain-Expiration/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) {
      rdapData = await response.json();
    }
  } catch {
    // RDAP failed, try fallback
  }

  // Fallback: try whois.freeaes.com or similar free whois API
  if (!rdapData) {
    try {
      const fallbackRes = await fetch(
        `https://whois.freeaes.com/?query=${encodeURIComponent(hostname)}&output=json`,
        {
          headers: { "User-Agent": "PulseGuard-Domain-Expiration/1.0" },
          signal: AbortSignal.timeout(10000),
        },
      );
      if (fallbackRes.ok) {
        rdapData = await fallbackRes.json();
        fallbackUsed = true;
      }
    } catch {
      // Both failed
    }
  }

  // Parse RDAP response
  if (!rdapData) {
    return {
      domain: hostname,
      expiryDate: null,
      daysRemaining: 0,
      registrar: null,
      registrantName: null,
      statuses: [],
      criticalStatuses: [],
      isExpired: false,
      isCritical: true,
      grade: "F",
    };
  }

  let expiryDate: string | null = null;
  const statuses: string[] = [];
  let registrar: string | null = null;
  let registrantName: string | null = null;

  if (fallbackUsed) {
    // freeaes.com format
    expiryDate = rdapData.expiration_date || null;
    registrar = rdapData.registrar || null;
    registrantName = rdapData.registrant_name || null;
    if (rdapData.status) {
      statuses.push(...(Array.isArray(rdapData.status) ? rdapData.status : [rdapData.status]));
    }
  } else {
    // Standard RDAP format
    if (rdapData.events) {
      const expEvent = rdapData.events.find(
        (e: any) => e.eventAction === "expiration" || e.eventAction === "last changed",
      );
      if (expEvent) expiryDate = expEvent.eventDate;
    }

    if (rdapData.status) {
      statuses.push(...(Array.isArray(rdapData.status) ? rdapData.status : [rdapData.status]));
    }

    if (rdapData.entities) {
      for (const entity of rdapData.entities) {
        if (!registrar && entity.roles?.includes("registrar")) {
          registrar = entity.handle || entity.vcardArray?.[1]?.[1]?.[3] || null;
        }
        if (!registrantName && entity.roles?.includes("registrant")) {
          registrantName = entity.vcardArray?.[1]?.[1]?.[3] || entity.handle || null;
        }
      }
    }
  }

  const daysRemaining = expiryDate ? daysUntil(expiryDate) : 0;
  const isExpired = daysRemaining === 0 && !!expiryDate;

  const criticalStatuses = statuses.filter((s) => CRITICAL_STATUSES.has(s));
  const isCritical = criticalStatuses.length > 0 || isExpired;

  let grade: DomainExpirationResult["grade"] = "A";
  if (isCritical) {
    grade = "F";
  } else if (daysRemaining <= 7) {
    grade = "D";
  } else if (daysRemaining <= 30) {
    grade = "C";
  } else if (daysRemaining <= 60) {
    grade = "B";
  }

  return {
    domain: hostname,
    expiryDate,
    daysRemaining,
    registrar,
    registrantName,
    statuses,
    criticalStatuses,
    isExpired,
    isCritical,
    grade,
  };
}
