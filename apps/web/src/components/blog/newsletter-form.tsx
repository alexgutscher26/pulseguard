"use client";

import { ArrowRight, Activity } from "lucide-react";

export default function NewsletterForm() {
  return (
    <section className="border-t border-border bg-background relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-border bg-card text-muted-foreground text-[10px] font-bold font-mono uppercase tracking-widest mb-6">
          <Activity className="size-3" />
          Stay in the Loop
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.15]">
          Get monitoring insights delivered
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-8">
          Engineering deep dives, product updates, and industry analysis. No spam — we promise.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 h-11 px-4 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors"
          />
          <button
            type="submit"
            className="h-11 px-6 bg-primary text-primary-foreground font-bold text-xs rounded-lg border border-primary hover:bg-primary/90 transition-all duration-300 shrink-0"
          >
            Subscribe <ArrowRight className="inline size-3.5 ml-1" />
          </button>
        </form>
      </div>
    </section>
  );
}
