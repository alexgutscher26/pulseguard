import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "How fast are the checks performed?",
      a: "Our verification sequences execute every 60 seconds from over 12 concurrent global zones using headless agents to guarantee maximum accuracy.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. Cancel instantly with no data lock-in. You will retain access to your telemetry and dashboards until the end of your billing cycle.",
    },
    {
      q: "Do you handle SSL expiry events?",
      a: "Absolutely. The SSL Module automatically scans for expiration dates, ciphers, and mistrust issues, alerting you 30 days in advance.",
    },
    {
      q: "What happens on monitor limit breach?",
      a: "Our system throws a soft warning at 90% capacity. Checking continues uninterrupted for existing nodes, but you must upgrade your tier to add new monitors.",
    },
    {
      q: "Is my infrastructure data secure?",
      a: "Yes, all telemetry data is stored securely. The PulseGuard agent runs on secure outbound-only endpoints and requires zero inbound port forwarding.",
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
