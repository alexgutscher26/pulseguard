import { Upload, Radar, BellRing } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect",
      description:
        "Import your API endpoints, servers, and domain details. PulseGuard maps your infrastructure instantly.",
      icon: <Upload className="size-8 text-primary" strokeWidth={1.5} />,
    },
    {
      number: "2",
      title: "Monitor",
      description:
        "Our global mesh checks responses and latencies from multiple regions to establish an operational baseline automatically.",
      icon: <Radar className="size-8 text-primary" strokeWidth={1.5} />,
    },
    {
      number: "3",
      title: "Alert",
      description:
        "Get instant notifications across Slack, SMS, and tools. The system handles 24/7 surveillance while you focus on growth.",
      icon: <BellRing className="size-8 text-primary" strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From setup to live surveillance in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-10 w-24 h-24 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center shadow-lg">
                <div className="absolute -top-3 -left-3 size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-[0_4px_15px_rgba(57,255,20,0.4)]">
                  {step.number}
                </div>
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
