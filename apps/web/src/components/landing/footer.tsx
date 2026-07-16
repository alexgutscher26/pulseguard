import Link from "next/link";
import { Activity, Twitter, Github } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="py-16 md:py-20 border-t border-border bg-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col gap-16">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
          {/* Col 1 - Brand */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/5 border border-primary/10 rounded-lg">
                <Activity className="size-4 text-primary" />
              </div>
              <span className="text-foreground font-bold tracking-tight text-base">PulseGuard</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium max-w-xs leading-relaxed">
              Global infrastructure uptime and latency surveillance made simple.
            </p>
          </div>

          {/* Col 2 - Product */}
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-wider">
              Product
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Pricing
              </Link>
              <Link
                href={"/comparison" as any}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Comparison
              </Link>
              <Link
                href={"/showcase" as any}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Showcase
              </Link>
              <Link
                href={"/hall-of-fame" as any}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Hall of Fame
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                API Docs
              </Link>
            </div>
          </div>

          {/* Col 3 - Company */}
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-wider">
              Company
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href={"/about" as any}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                About
              </Link>
              <Link
                href={"/blog" as any}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Col 4 - Legal */}
          <div className="flex flex-col gap-4">
            <span className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-wider">
              Legal
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors w-fit"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
          <span className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} PulseGuard. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link
              href="https://x.com/snackforcode"
              className="hover:text-foreground transition-all"
            >
              <Twitter className="size-[17px]" />
            </Link>
            <Link
              href="https://github.com/alexgutscher26/pulseguard"
              className="hover:text-foreground transition-all"
            >
              <Github className="size-[17px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
