import { Activity, BellRing, BarChart3, Database, Globe, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Activity className="size-5" />,
      code: "MOD_UPTIME",
      title: "Uptime Surveillance",
      description: "Global checks every 60s from 20+ edge locations. 50ms latency tolerance."
    },
    {
        icon: <BellRing className="size-5" />,
        code: "MOD_ALERT",
        title: "Interrupt System",
        description: "Zero-delay notifications via Webhook, Slack, Discord, or SMS gateway."
    },
    {
        icon: <BarChart3 className="size-5" />,
        code: "MOD_ANALYTICS",
        title: "Telemetry Data",
        description: "Raw latency logs, incident history, and TTFB breakdown with 1-year retention."
    },
    {
        icon: <Globe className="size-5" />,
        code: "MOD_GEO",
        title: "Global Mesh",
        description: "Distributed node network across 12 regions for localized availability checks."
    },
    {
        icon: <Shield className="size-5" />,
        code: "MOD_SECURE",
        title: "SSL Verification",
        description: "Automated certificate monitoring with expiry alerts 30 days prior."
    },
    {
        icon: <Database className="size-5" />,
        code: "MOD_ARCHIVE",
        title: "Incident Logs",
        description: "Immutable record of all downtimes for post-mortem analysis."
    }
  ];

  return (
    <section className="py-24 bg-background border-b border-border relative overflow-hidden" id="features">
      <div className="absolute left-0 top-0 h-full w-[1px] bg-border/50"></div>
      <div className="absolute right-0 top-0 h-full w-[1px] bg-border/50"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-12">
          
          <div className="flex flex-col gap-4 border-l-2 border-primary pl-6">
            <h2 className="text-foreground text-4xl font-black tracking-tighter uppercase font-mono">
                System Capabilities
            </h2>
            <p className="text-muted-foreground text-lg font-mono leading-relaxed max-w-2xl">
                // MODULES_LOADED: 6/6<br/>
                // STATUS: OPERATIONAL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
            {features.map((feature, i) => (
                <div key={i} className="flex flex-col gap-4 bg-background p-8 hover:bg-muted/30 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-[10px] text-muted-foreground">
                        {feature.code}
                    </div>
                    
                    <div className="size-10 flex items-center justify-center text-primary border border-primary/20 bg-primary/5 rounded-sm group-hover:border-primary group-hover:bg-primary group-hover:text-background transition-all">
                        {feature.icon}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <h3 className="text-foreground text-lg font-bold font-mono uppercase tracking-wide group-hover:text-primary transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm font-mono leading-relaxed border-t border-border/50 pt-2">
                            {feature.description}
                        </p>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-r-[20px] border-b-transparent border-r-primary/0 group-hover:border-r-primary transition-all duration-300"></div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
