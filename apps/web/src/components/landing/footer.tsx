import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="text-primary opacity-70">
              <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V44H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-muted-foreground font-bold">PulseGuard © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <Link className="text-muted-foreground hover:text-foreground transition-colors text-sm" href="#">Twitter</Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors text-sm" href="#">Status Page</Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors text-sm" href="#">Privacy Policy</Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors text-sm" href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
