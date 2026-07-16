import { ChevronDown } from "lucide-react";
import { PRODUCT_CONFIG, AVAILABLE_REGIONS } from "@pulseguard/shared";

export default function FAQ() {
  const faqs = [
    {
      q: "How fast are the checks performed, and are there interval limits per tier?",
      a: `Verification checks execute natively at the edge. The check frequency depends on your subscription tier: the Initiate (Free) tier supports intervals down to 60 seconds, the Netrunner plan supports down to 30 seconds, and the Construct (Enterprise) plan supports high-frequency telemetry checks down to 10 seconds. Checks are distributed across our ${AVAILABLE_REGIONS.length}+ concurrent global edge regions using sandboxed headless agents.`,
    },
    {
      q: "What is multi-region consensus verification, and how does it prevent false alerts?",
      a: "Outages on the Internet are often localized due to routing anomalies or regional network drops. When a PulseGuard edge probe detects that your monitor is DOWN, it does not immediately trigger an alert. Instead, it queries other global zones to establish a 2/3 consensus. If multiple nodes confirm the target is unreachable, it escalates to an incident. This voting system completely eliminates false positives caused by regional CDN drops or localized route flapping.",
    },
    {
      q: "How do private probes monitor internal infrastructure behind firewalls?",
      a: "Our lightweight dockerized probes run internally on your own secure private subnets. Instead of requiring you to open incoming firewall ports or set up public DNS records, the private probe establishes a secure outbound WebSocket control channel to our edge Durable Objects. The probe securely polls jobs, executes them locally, and pushes metrics back to PulseGuard, ensuring zero inbound security risks.",
    },
    {
      q: "What notification channels are supported for dispatches?",
      a: "Alerts can be routed dynamically based on severity thresholds. We support instant dispatches to Slack, Discord webhooks, Microsoft Teams, and email. For team alerting rotation, the Construct plan integrates directly with pager services like PagerDuty or custom webhook endpoints to execute automated disaster recovery actions.",
    },
    {
      q: "What are the exact capabilities and limits of the Initiate (Free) plan?",
      a: `The Initiate plan is designed for side projects and indie developers. It includes 50 active monitors, 60-second checks, 1 public status page, and up to ${PRODUCT_CONFIG.FREE_CHECKS_LIMIT.toLocaleString()} free checks per month. It requires no credit card and supports HTTP, SSL/TLS, DNS, and Heartbeat checks with 3 days of log retention.`,
    },
    {
      q: "Can I monitor protocols other than standard web pages?",
      a: "Yes. PulseGuard supports comprehensive system checks including HTTP/HTTPS, SSL/TLS certificate handshakes, DNS records (A, MX, TXT, CAA), TCP port reachability, ICMP PING, and multi-step browser sequence simulations. Note that advanced protocols like TCP/Ping and browser sequences require upgrading to a paid tier (Netrunner or higher).",
    },
    {
      q: "How does the SSL/TLS monitoring module work?",
      a: "The SSL monitoring module proactively connects to your secure endpoints to verify the entire certificate chain. It checks the certificate authority trust, key strength compliance, subject alternative names (SANs), certificate transparency logs, and revocation status via OCSP stapling. You will receive warning alerts 30 days prior to expiration to prevent unexpected certificate lapses.",
    },
    {
      q: "Can I customize the look of my public status pages?",
      a: "Absolutely. PulseGuard supports custom themes, status grid layouts, and white-labeling. You can map public pages to your own custom domain, configure responsive grid widgets, and select themes (such as Matrix Green, Cyberpunk Pink, or Terminal Dark). Paid plans allow you to completely remove PulseGuard branding.",
    },
    {
      q: "How secure is my telemetry data, and what is your log retention policy?",
      a: `All client settings, credentials, and telemetry headers are encrypted at rest and in transit. Raw event logs and latency metrics are retained depending on your tier: 3 days for the Initiate tier, 30 days for the Netrunner tier, and up to 1 full year for the Construct tier. High-tier plans also support full automated data exports to external storage objects without vendor lock-in.`,
    },
  ];

  return (
    <section className="py-28 bg-background relative overflow-hidden" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Support</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Find immediate answers regarding PulseGuard's global network, subscription models, and
            telemetry configurations.
          </p>
        </div>

        {/* Minimalist Separator Layout */}
        <div className="divide-y divide-border border-t border-b border-border">
          {faqs.map((item, i) => (
            <details key={i} className="group overflow-hidden transition-all duration-300">
              <summary className="flex items-center justify-between py-5 cursor-pointer font-semibold text-foreground hover:text-primary transition-colors list-none outline-none focus-visible:ring-1 focus-visible:ring-primary/50 [&::-webkit-details-marker]:hidden">
                <span className="text-sm sm:text-base tracking-tight">{item.q}</span>
                <ChevronDown className="size-4 text-muted-foreground/60 group-open:rotate-180 group-open:text-primary transition-all duration-300 shrink-0 ml-4" />
              </summary>
              <div className="pb-5 text-muted-foreground text-xs leading-relaxed transition-all duration-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
