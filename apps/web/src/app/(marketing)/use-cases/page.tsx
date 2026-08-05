import Link from "next/link";
import { ArrowRight, Server, ShoppingCart, Layers, Code, ShieldCheck } from "lucide-react";
import { USE_CASES } from "@/content/use-cases-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Use Cases & Solutions | PulseGuard",
  description:
    "Discover how PulseGuard provides tailormade monitoring solutions for DevOps, E-Commerce, SaaS, and API Developers.",
};

const iconMap: Record<string, any> = {
  devops: Server,
  ecommerce: ShoppingCart,
  saas: Layers,
  "api-monitoring": Code,
};

export default function UseCasesIndexPage() {
  const useCaseList = Object.values(USE_CASES);

  return (
    <div className="pt-32 pb-24 bg-background text-foreground relative overflow-hidden min-h-screen">
      {/* Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="size-3.5" />
            Tailored Monitoring Solutions
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Built for Your Specific <span className="text-emerald-400">Engineering Workflow</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-sans">
            Whether you&apos;re managing cloud microservices, operating an e-commerce platform, or
            running an enterprise SaaS, PulseGuard delivers zero false-positive edge monitoring
            tailored to your stack.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {useCaseList.map((item) => {
            const IconComponent = iconMap[item.slug] || Server;
            return (
              <Link
                key={item.slug}
                href={`/use-cases/${item.slug}` as any}
                className="group relative p-8 rounded-2xl border border-border/80 bg-zinc-950/60 backdrop-blur-xl hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                      <IconComponent className="size-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      {item.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground group-hover:text-emerald-400 transition-colors mb-2 font-mono">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-sans">
                    {item.subtitle}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/40 mb-6">
                    {item.keyMetrics.map((metric, i) => (
                      <div key={i} className="text-left">
                        <div className="text-base font-bold font-mono text-emerald-400">
                          {metric.value}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-xs font-mono font-bold text-emerald-400 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                    Explore Solution <ArrowRight className="size-3.5 ml-1.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-xl font-bold font-mono text-foreground mb-1">
              Ready to Monitor Your Infrastructure?
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Get started with 50 free monitors and 1-minute check intervals in under 60 seconds.
            </p>
          </div>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 px-6 text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 uppercase tracking-wider shrink-0",
            )}
          >
            Start Free Trial <ArrowRight className="size-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
