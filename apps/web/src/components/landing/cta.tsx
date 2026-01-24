import Link from "next/link";
import { Terminal } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 border-t border-border bg-muted/5 relative overflow-hidden">
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-20">
            <div className="border border-primary/50 bg-black p-8 md:p-12 relative flex flex-col items-center text-center gap-8 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                {/* Decorative Terminal Header */}
                 <div className="absolute top-0 left-0 right-0 h-8 bg-border/20 border-b border-border/50 flex items-center px-4 justify-between">
                     <span className="text-[10px] uppercase font-mono text-muted-foreground">root@pulse-guard:~#</span>
                     <div className="flex gap-1.5">
                         <div className="size-2 rounded-full bg-border"></div>
                         <div className="size-2 rounded-full bg-border"></div>
                     </div>
                 </div>

                <div className="mt-6 flex flex-col items-center gap-4">
                     <div className="size-16 border border-primary/50 bg-primary/10 flex items-center justify-center rounded-full mb-2">
                         <Terminal className="size-8 text-primary animate-pulse" />
                     </div>
                     
                    <h2 className="text-foreground text-3xl md:text-5xl font-black font-mono uppercase tracking-tighter">
                        Ready to Secure<br/>
                        <span className="text-primary">Your Infrastructure?</span>
                    </h2>
                    
                    <p className="text-muted-foreground text-lg font-mono max-w-xl">
                        Join 5,000+ engineers who get pinged before their users do.
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-md">
                     <div className="font-mono text-xs text-start text-muted-foreground pl-1">
                         $ ./initialize_setup.sh --email user@example.com
                     </div>
                     <Link href="/signup" className="flex w-full cursor-pointer items-center justify-center h-14 bg-primary text-black text-lg font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-all border border-primary shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.5)]">
                        &gt; Execute Setup
                    </Link>
                    <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest text-center mt-2">
                        [ No Credit Card Required ]
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}
