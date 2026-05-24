import { Upload, Radar, BellRing } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      category: "Connect",
      title: "Integrate Endpoints",
      description:
        "Input your API endpoints, server nodes, and domains. PulseGuard catalogs your stack layout immediately.",
      icon: <Upload className="size-5 text-primary" strokeWidth={1.8} />,
    },
    {
      number: "02",
      category: "Surveillance",
      title: "Establish Monitoring",
      description:
        "Our global network coordinates checks across multiple regions to compute an active performance baseline.",
      icon: <Radar className="size-5 text-primary" strokeWidth={1.8} />,
    },
    {
      number: "03",
      category: "Alerting",
      title: "Receive Alerts",
      description:
        "Connect directly to Slack, Discord, SMS, or PagerDuty. Get notified instantly when performance degrades.",
      icon: <BellRing className="size-5 text-primary" strokeWidth={1.8} />,
    },
  ];

  return (
    <section
      className="py-28 bg-background relative overflow-hidden border-b border-border"
      id="how-it-works"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-20">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Go from initial configuration to live global monitoring in three straightforward steps.
          </p>
        </div>

        {/* Technical pipeline cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-start relative z-10 group">
              {/* Process indicator box */}
              <div className="relative mb-6 w-14 h-14 bg-muted/40 border border-border rounded-xl flex items-center justify-center group-hover:border-primary/20 transition-all duration-300">
                {step.icon}
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                <span>{step.number}</span>
                <span className="text-border">/</span>
                <span className="text-muted-foreground/80">{step.category}</span>
              </div>

              <h3 className="text-base font-bold text-foreground tracking-tight mb-2 uppercase">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
