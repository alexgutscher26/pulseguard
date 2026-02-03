import Link from "next/link";
import { Terminal } from "lucide-react";
import LandingHeader from "@/components/landing/header";

export default function AuthLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[linear-gradient(to_bottom,#050505,#0a0a0a)] text-foreground font-mono selection:bg-primary/20">
      <LandingHeader />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Scanlines Overlay */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none z-10"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest w-fit">
              <Terminal className="size-3" />
              <span>Secure Access</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-600 text-glow">
              {title}
            </h1>
          </div>

          <div className="relative group">
            {/* Border Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary z-30"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary z-30"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary z-30"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary z-30"></div>

            {/* Card Content */}
            <div className="relative rounded-sm border border-border bg-black/90 p-1 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/50">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-red-500/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500/50 rounded-full"></div>
                </div>
                <div className="text-[10px] uppercase text-muted-foreground">auth_protocol.exe</div>
              </div>
              <div className="p-6">{children}</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">&lt;</span> Return
              to Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
