import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCT_CONFIG } from "@pulseguard/shared";

export default function CTA() {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden flex justify-center px-6"
      id="cta"
    >
      <div className="w-full max-w-5xl border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] rounded-3xl px-8 py-20 md:py-28 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle backdrop blur gradient */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6 max-w-3xl uppercase">
          Ready to secure your backend?
        </h2>

        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mb-10">
          Get started with {PRODUCT_CONFIG.FREE_CHECKS_LIMIT.toLocaleString()} free checks. Try all core monitoring systems without a credit card.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative z-10">
          <Link
            href="/signup"
            className="flex items-center justify-center h-10.5 px-6 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-lg transition-colors w-full sm:w-auto"
          >
            Start Free Trial <ArrowRight className="ml-1.5 size-3.5" />
          </Link>

          <Link
            href="#pricing"
            className="flex items-center justify-center h-10.5 px-6 bg-transparent border border-border hover:bg-accent text-foreground text-xs font-semibold rounded-lg transition-colors w-full sm:w-auto"
          >
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  );
}

