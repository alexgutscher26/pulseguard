import Link from "next/link";
import { ChevronRight, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center border-b border-border bg-[linear-gradient(to_bottom,#050505,#0a0a0a)]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Scanlines Overlay */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest w-fit">
              <Terminal className="size-3" />
              <span>v2.0.4 :: Stable Release</span>
            </div>

            <h1 className="text-foreground text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter font-mono uppercase">
              System <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-600 text-glow">
                Critical
              </span>{" "}
              <br />
              Uptime.
            </h1>

            <p className="text-muted-foreground text-xl md:text-2xl font-mono leading-relaxed max-w-2xl border-l-2 border-primary/50 pl-6">
              &gt; Initiating global surveillance protocol.
              <br />
              &gt; 50ms latency checks.
              <br />
              &gt; Zero false positives accepted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                href="/signup"
                className="flex min-w-[200px] cursor-pointer items-center justify-center h-14 px-8 bg-primary text-black text-lg font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-all border border-primary shine group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Monitor <ChevronRight className="size-5" />
                </span>
              </Link>
              <Link
                href="#demo"
                className="flex min-w-[200px] cursor-pointer items-center justify-center h-14 px-8 bg-black border border-border text-foreground text-lg font-mono font-bold uppercase tracking-widest hover:bg-border transition-all hover:text-primary"
              >
                View Logs
              </Link>
            </div>
          </div>

          {/* Visual Content: "The Terminal" */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-none border border-border bg-black/90 p-1 shadow-2xl backdrop-blur-sm group">
              {/* Decorative Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500/50 rounded-sm"></div>
                  <div className="w-3 h-3 bg-yellow-500/50 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500/50 rounded-sm"></div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">
                  usr/bin/pulse-monitor
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm h-[400px] overflow-hidden flex flex-col gap-2 relative">
                {/* Faux Data Stream */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent h-[20%] animate-scan pointer-events-none"></div>

                <div className="flex gap-4 text-green-500/80">
                  <span className="opacity-50">09:41:22</span>
                  <span>[INFO] Check initiated: us-east-1</span>
                  <span className="ml-auto text-primary">24ms</span>
                </div>
                <div className="flex gap-4 text-green-500/80">
                  <span className="opacity-50">09:41:23</span>
                  <span>[INFO] Check initiated: eu-west-2</span>
                  <span className="ml-auto text-primary">89ms</span>
                </div>
                <div className="flex gap-4 text-green-500/80">
                  <span className="opacity-50">09:41:23</span>
                  <span>[INFO] Check initiated: ap-northeast-1</span>
                  <span className="ml-auto text-primary">112ms</span>
                </div>
                <div className="flex gap-4 text-yellow-500/80">
                  <span className="opacity-50">09:41:24</span>
                  <span>[WARN] Latency spike detected: sa-east-1</span>
                  <span className="ml-auto text-yellow-500">450ms</span>
                </div>
                <div className="flex gap-4 text-green-500/80">
                  <span className="opacity-50">09:41:25</span>
                  <span>[INFO] Rerouting check via backup node...</span>
                </div>
                <div className="flex gap-4 text-primary">
                  <span className="opacity-50">09:41:26</span>
                  <span>[SUCCESS] Connection verified.</span>
                  <span className="ml-auto text-primary">OK</span>
                </div>
                {/* Blinking Cursor */}
                <div className="mt-4 flex gap-2">
                  <span className="text-primary">{">"}</span>
                  <span className="w-2 h-4 bg-primary animate-pulse"></span>
                </div>
              </div>

              {/* Border Corners */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            </div>
            {/* Back glow */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Ticker at bottom */}
      <div className="absolute bottom-0 w-full bg-primary/10 border-t border-primary/20 py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-12 items-center font-mono text-xs uppercase tracking-widest text-primary/70">
          <span>System Status: Optimal</span>
          <span>Active Monitors: 8,492</span>
          <span>Global Uptime: 99.99%</span>
          <span>Incidents (24h): 0</span>
          <span>Next Schedule: 10s</span>
          <span>System Status: Optimal</span>
          <span>Active Monitors: 8,492</span>
          <span>Global Uptime: 99.99%</span>
          <span>Incidents (24h): 0</span>
          <span>Next Schedule: 10s</span>
        </div>
      </div>
    </section>
  );
}
