import { Plus } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "How fast are the checks performed?",
      a: "Our Pro Protocol executes verification sequences every 60 seconds from 12 concurrent global zones using headless browser agents.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. The termination protocol is instant. No data lock-in. You retain access until the end of the billing cycle.",
    },
    {
      q: "Do you handle SSL expiry events?",
      a: "Affirmative. The SSL Module automatically scans for expiration dates, ciphers, and mistrust issues 30 days in advance.",
    },
    {
      q: "What happens on monitor limit breach?",
      a: "System throws a soft warning at 90% capacity. Checking continues for existing nodes. You must upgrade tier to add new nodes.",
    },
  ];

  return (
    <section className="py-24 bg-muted/5" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12 border-l-2 border-primary pl-6">
          <h2 className="text-foreground text-4xl font-black tracking-tighter uppercase font-mono">
            Knowledge Base
          </h2>
          <p className="text-muted-foreground font-mono mt-2">// QUERY: COMMON_ISSUES</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group border border-border bg-background open:border-primary/50 transition-colors"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer font-mono font-bold text-foreground uppercase tracking-wide list-none selection:bg-primary/20 hover:bg-muted/30 transition-colors">
                <span>
                  KNB_{i + 1}: {item.q}
                </span>
                <Plus className="size-4 text-primary group-open:rotate-45 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-muted-foreground font-mono text-sm leading-relaxed border-t border-border/50 pt-4">
                &gt; {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
