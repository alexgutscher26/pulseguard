import Link from "next/link";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-24 bg-background border-b border-border" id="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 border-l-2 border-primary pl-6">
            <h2 className="text-foreground text-4xl font-black tracking-tighter uppercase font-mono">Resource Allocation</h2>
            <p className="text-muted-foreground font-mono mt-2">// SELECT_TIER: INITIATE</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="border border-border bg-background relative flex flex-col">
                <div className="border-b border-border p-6 bg-muted/10">
                    <h3 className="text-muted-foreground font-mono text-sm uppercase tracking-widest">[ COMMUNITY ]</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-foreground text-5xl font-black font-mono">$0</span>
                        <span className="text-muted-foreground text-sm font-mono">/MO</span>
                    </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col gap-6">
                    <div className="font-mono text-sm space-y-4">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Monitors</span>
                            <span className="text-foreground font-bold">5 Nodes</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Check Interval</span>
                            <span className="text-foreground font-bold">5 Min</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Data Retention</span>
                            <span className="text-foreground font-bold">24 Hours</span>
                        </div>
                         <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Alerts</span>
                            <span className="text-foreground font-bold">Email Only</span>
                        </div>
                    </div>
                    
                    <Link href="/signup" className="mt-auto flex w-full items-center justify-center h-12 border border-border hover:bg-muted text-foreground font-mono text-sm font-bold uppercase tracking-wider transition-all">
                        &gt; Deploy Free Tier
                    </Link>
                </div>
            </div>
            
            {/* Pro Tier */}
            <div className="border border-primary bg-background relative flex flex-col shadow-[0_0_30px_rgba(57,255,20,0.1)]">
                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-mono font-bold uppercase px-2 py-1">
                    Recommended
                </div>
                
                <div className="border-b border-primary/30 p-6 bg-primary/5">
                    <h3 className="text-primary font-mono text-sm uppercase tracking-widest">[ PRO ]</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-foreground text-5xl font-black font-mono">$20</span>
                        <span className="text-muted-foreground text-sm font-mono">/MO</span>
                    </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col gap-6">
                    <div className="font-mono text-sm space-y-4">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Monitors</span>
                            <span className="text-primary font-bold">50 Nodes</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Check Interval</span>
                            <span className="text-primary font-bold">60 Seconds</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Data Retention</span>
                            <span className="text-primary font-bold">2 Years</span>
                        </div>
                         <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Alerts</span>
                            <span className="text-primary font-bold">SMS / Slack / Hook</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Status Pages</span>
                            <span className="text-primary font-bold">Unlimited</span>
                        </div>
                    </div>
                    
                    <Link href="/signup" className="mt-auto flex w-full items-center justify-center h-12 bg-primary hover:bg-primary/90 text-black font-mono text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden group">
                        <span className="relative z-10">&gt; Upgrade Protocol</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
