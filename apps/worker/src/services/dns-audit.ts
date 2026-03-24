
export async function auditDNS(domain: string) {
  const records: Record<string, any> = {
    MX: [],
    SPF: null,
    DMARC: null,
  };

  const fetchDns = async (type: string, name: string) => {
    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`, {
        headers: { "accept": "application/dns-json" }
      });
      return await res.json();
    } catch {
      return null;
    }
  };

  // 1. MX Records
  const mxRes: any = await fetchDns("MX", domain);
  if (mxRes?.Answer) {
    records.MX = mxRes.Answer.map((a: any) => a.data);
  }

  // 2. SPF (TXT on domain)
  const txtRes: any = await fetchDns("TXT", domain);
  if (txtRes?.Answer) {
    const spfRecord = txtRes.Answer.find((a: any) => a.data.includes("v=spf1"));
    if (spfRecord) records.SPF = spfRecord.data.replace(/"/g, "");
  }

  // 3. DMARC (TXT on _dmarc.domain)
  const dmarcRes: any = await fetchDns("TXT", `_dmarc.${domain}`);
  if (dmarcRes?.Answer) {
    const dmarcRecord = dmarcRes.Answer.find((a: any) => a.data.includes("v=DMARC1"));
    if (dmarcRecord) records.DMARC = dmarcRecord.data.replace(/"/g, "");
  }

  // Scoring & Analysis
  const results = [];
  let score = 0;

  // MX Audit
  if (records.MX.length > 0) {
    score += 30;
    results.push({ 
      key: "MX", 
      status: "SECURE", 
      value: records.MX.join(", "), 
      desc: "Mail exchange records configured. Domain can receive mail." 
    });
  } else {
    results.push({ 
      key: "MX", 
      status: "CRITICAL", 
      value: "None", 
      desc: "No MX records found. This domain cannot receive email." 
    });
  }

  // SPF Audit
  if (records.SPF) {
    score += 35;
    const isStrict = records.SPF.includes("-all");
    results.push({ 
      key: "SPF", 
      status: isStrict ? "SECURE" : "WARNING", 
      value: records.SPF, 
      desc: isStrict ? "SPF policy is strict (-all)." : "SPF policy is soft (~all). Consider hardening to -all." 
    });
  } else {
    results.push({ 
      key: "SPF", 
      status: "CRITICAL", 
      value: "Missing", 
      desc: "SPF record missing. Spammers can easily spoof your domain." 
    });
  }

  // DMARC Audit
  if (records.DMARC) {
    score += 35;
    const isEnforced = records.DMARC.includes("p=reject") || records.DMARC.includes("p=quarantine");
    results.push({ 
      key: "DMARC", 
      status: isEnforced ? "SECURE" : "WARNING", 
      value: records.DMARC, 
      desc: isEnforced ? "DMARC policy is enforced (reject/quarantine)." : "DMARC policy is set to none. It provides visibility but no protection." 
    });
  } else {
    results.push({ 
      key: "DMARC", 
      status: "CRITICAL", 
      value: "Missing", 
      desc: "DMARC record missing. Essential for modern email deliverability." 
    });
  }

  const grades: Record<number, string> = { 100: "A+", 90: "A", 80: "B", 70: "C", 60: "D" };
  const grade = grades[Math.floor(score / 10) * 10] || "F";

  return {
    domain,
    score,
    grade,
    results,
    raw: records
  };
}
