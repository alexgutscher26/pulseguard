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
    <section className="py-24 bg-background relative overflow-hidden" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Frequently asked <span className="text-primary">questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about PulseGuard
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-foreground hover:bg-white/5 transition-colors list-none outline-none focus-visible:ring-1 focus-visible:ring-primary/50 [&::-webkit-details-marker]:hidden">
                <span className="text-[15px] sm:text-base">{item.q}</span>
                <ChevronDown className="size-4 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" />
              </summary>
              <div className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed pt-2">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
