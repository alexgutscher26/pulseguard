import Link from "next/link";
import { ArrowRight, CornerDownLeft, Command } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center bg-background">
      {/* Background Glow matching the image */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-20 w-full text-center flex flex-col items-center">
        
        {/* Header */}
        <h1 className="text-5xl md:text-[5rem] font-bold tracking-tight leading-none mb-8">
          <span className="text-primary">System critical uptime</span>
          <br />
          <span className="text-foreground">with zero false positives</span>
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
          Pulseguard transforms your monitoring with surveillance protocols that verify connections, ensure 50ms latency checks, and alert instantly. 24/7 monitoring that scales with your infrastructure.
        </p>

        {/* Input Bar */}
        <div className="relative w-full max-w-2xl mb-12 rounded-2xl bg-[#0a0a0a] border border-white/5 shadow-[0_0_40px_-10px_rgba(57,255,20,0.15)] transition-shadow hover:shadow-[0_0_60px_-15px_rgba(57,255,20,0.2)]">
          <div className="flex items-center px-4 py-3">
            <input 
              type="text" 
              placeholder="https://api.your-app.com |"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 border-none outline-none text-lg min-w-0"
            />
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <div className="hidden sm:flex items-center gap-1 text-muted-foreground/50 text-xs font-mono">
                <Command className="size-3" />
                <CornerDownLeft className="size-3" />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-xl transition-colors">
                Try it
              </button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center gap-3 text-muted-foreground/30 mb-8 font-mono text-xs">
          <span>✕</span>
          <span>◇</span>
          <span>✕</span>
          <span>◇</span>
        </div>

        {/* Stats */}
        <div className="mb-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            <span className="text-primary">10,000</span> free checks
          </h2>
        </div>
        <p className="text-muted-foreground/60 mb-12 font-medium">
          deploy global monitors instantly
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-full transition-colors"
          >
            Start Free Trial <ArrowRight className="ml-2 size-4" />
          </Link>
          <Link
            href="#demo"
            className="flex items-center justify-center h-12 px-8 bg-transparent border border-white/10 text-foreground text-base font-semibold rounded-full hover:bg-white/5 transition-colors"
          >
            View Docs <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
