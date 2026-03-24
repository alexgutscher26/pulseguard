import Link from "next/link";
import { Zap, Twitter, Github } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="py-16 md:py-24 border-t border-white/5 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
          {/* Col 1 - Brand */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-primary" fill="currentColor" strokeWidth={1} />
              <span className="text-foreground font-bold tracking-tight text-xl">PulseGuard</span>
            </div>
            <p className="text-muted-foreground text-[15px] font-medium max-w-xs leading-relaxed">
              Global infrastructure surveillance made simple.
            </p>
          </div>

          {/* Col 2 - Product */}
          <div className="flex flex-col gap-5">
            <span className="text-muted-foreground/50 text-[11px] font-bold uppercase tracking-widest">
              PRODUCT
            </span>
            <div className="flex flex-col gap-3">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                API Docs
              </Link>
            </div>
          </div>

          {/* Col 3 - Company */}
          <div className="flex flex-col gap-5">
            <span className="text-muted-foreground/50 text-[11px] font-bold uppercase tracking-widest">
              COMPANY
            </span>
            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Col 4 - Legal */}
          <div className="flex flex-col gap-5">
            <span className="text-muted-foreground/50 text-[11px] font-bold uppercase tracking-widest">
              LEGAL
            </span>
            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-[14px] font-medium transition-colors w-fit"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Sidebar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          <span className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} PulseGuard. All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-muted-foreground">
            <Link href="#" className="hover:text-foreground hover:scale-105 transition-all">
              <Twitter className="size-[18px]" />
            </Link>
            <Link href="#" className="hover:text-foreground hover:scale-105 transition-all">
              <Github className="size-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
