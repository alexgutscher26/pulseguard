import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden flex justify-center px-6"
      id="cta"
    >
      <div className="w-full max-w-5xl border border-dashed border-primary/40 bg-transparent rounded-[40px] px-8 py-20 md:py-28 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight text-foreground leading-[1.1] mb-6 max-w-3xl">
          Ready to secure your infrastructure?
        </h2>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12">
          Start with 10,000 free checks. No credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            href="/signup"
            className="flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-full transition-colors w-full sm:w-auto"
          >
            Start Free Trial <ArrowRight className="ml-2 size-4" />
          </Link>

          <Link
            href="#contact"
            className="flex items-center justify-center h-12 px-8 bg-transparent border border-white/10 hover:bg-white/5 text-foreground text-base font-semibold rounded-full transition-colors w-full sm:w-auto"
          >
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
