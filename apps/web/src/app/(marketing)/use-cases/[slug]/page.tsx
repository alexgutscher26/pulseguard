import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Server,
  Code2,
  BellRing,
  Network,
  CreditCard,
  ShoppingCart,
  Globe,
  TrendingUp,
  FileCheck,
  Sparkles,
  Users,
  Workflow,
  FileJson,
  ShieldAlert,
  Radio,
  Quote,
} from "lucide-react";
import { USE_CASES } from "@/content/use-cases-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const iconMap: Record<string, any> = {
  Server,
  Code2,
  BellRing,
  Network,
  CreditCard,
  ShoppingCart,
  Globe,
  TrendingUp,
  FileCheck,
  Sparkles,
  Users,
  Workflow,
  FileJson,
  ShieldAlert,
  Radio,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = USE_CASES[slug];
  if (!useCase) return { title: "Use Case Not Found | SteadyStack" };

  return {
    title: `${useCase.title} | SteadyStack`,
    description: useCase.subtitle,
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = USE_CASES[slug];

  if (!useCase) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 bg-background text-foreground relative overflow-hidden min-h-screen">
      {/* Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-8">
          <Link href={"/use-cases" as any} className="hover:text-primary transition-colors">
            Use Cases
          </Link>
          <span>/</span>
          <span className="text-primary capitalize">{slug}</span>
        </div>

        {/* Hero Section */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="size-3.5" />
            {useCase.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-balance font-mono">
            {useCase.title}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl font-sans mb-8">
            {useCase.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-6 text-xs font-mono font-bold bg-primary hover:opacity-90 text-primary-foreground uppercase tracking-wider",
              )}
            >
              Start Free Trial <ArrowRight className="size-4 ml-1.5" />
            </Link>
            <Link
              href={"/demo" as any}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-6 text-xs font-mono font-bold border-border hover:border-primary/40 uppercase tracking-wider",
              )}
            >
              Explore Live Sandbox
            </Link>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-xl mb-16 shadow-xl">
          {useCase.keyMetrics.map((metric, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-muted/40 border border-border">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-xs font-bold font-mono text-foreground uppercase tracking-wider mb-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-muted-foreground font-sans">{metric.detail}</div>
            </div>
          ))}
        </div>

        {/* Tailored Features Breakdown */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-mono text-foreground mb-8">
            Key Architecture Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCase.features.map((feature, idx) => {
              const IconComp = iconMap[feature.iconName] || Server;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border bg-card/60 hover:border-primary/30 transition-all duration-200 flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary shrink-0">
                    <IconComp className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Architecture Pipeline */}
        <div className="mb-20 p-8 rounded-2xl border border-border bg-card/80 backdrop-blur-xl">
          <h2 className="text-2xl font-bold font-mono text-foreground mb-8 text-center">
            How SteadyStack Operates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCase.architecturePoints.map((point, idx) => (
              <div key={idx} className="relative p-5 rounded-xl border border-border bg-muted/40">
                <div className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded border border-primary/30 bg-primary/10 inline-block mb-3">
                  {point.step}
                </div>
                <h3 className="text-sm font-bold font-mono text-foreground mb-1">{point.title}</h3>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Quote / Social Proof Card */}
        <div className="mb-20 p-8 rounded-2xl border border-border bg-card/90 relative overflow-hidden shadow-xl">
          <Quote className="absolute -right-4 -bottom-4 size-32 text-primary/5 pointer-events-none" />
          <p className="text-base sm:text-lg font-sans italic text-foreground/90 leading-relaxed mb-6">
            &ldquo;{useCase.quote.text}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-mono font-bold text-primary text-sm">
              {useCase.quote.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-foreground">
                {useCase.quote.author}
              </div>
              <div className="text-xs text-muted-foreground font-sans">
                {useCase.quote.role} • {useCase.quote.company}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-12 rounded-2xl border border-primary/30 bg-card/90 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl font-extrabold font-mono text-foreground mb-3">
            Get Started with SteadyStack Today
          </h2>
          <p className="text-sm text-muted-foreground font-sans max-w-xl mx-auto mb-8">
            Deploy 1-minute monitoring checks for your endpoints in less than 60 seconds. Free
            forever up to 50 endpoints.
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 px-8 text-xs font-mono font-bold bg-primary hover:opacity-90 text-primary-foreground uppercase tracking-wider",
            )}
          >
            Create Free Account Now <ArrowRight className="size-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
