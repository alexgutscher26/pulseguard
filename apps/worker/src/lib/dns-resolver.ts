/**
 * Performs a DNS-over-HTTPS (DoH) lookup for a given hostname using Cloudflare's public resolver.
 */
export async function resolveDNS(hostname: string): Promise<string | null> {
  try {
    // We strictly look for 'A' records (IPv4)
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`;
    const response = await fetch(url, {
      headers: { accept: "application/dns-json" },
    });

    if (!response.ok) return null;

    const data: any = await response.json();

    // Status 0 means NOERROR
    if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
      // Find the first A record (Type 1)
      const aRecord = data.Answer.find((a: any) => a.type === 1);
      return aRecord ? aRecord.data : null;
    }
    return null;
  } catch (err) {
    console.error(`[DNS] Failed to resolve ${hostname}:`, err);
    return null;
  }
}
