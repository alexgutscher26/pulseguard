import Link from "next/link";
import { GlitchText } from "@/components/ui/effects/glitch-text";

/**
 * Renders a 404 Not Found page.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background text-foreground space-y-6 text-center p-4">
      <div className="text-9xl font-mono font-bold tracking-tighter opacity-90 select-none">
        <GlitchText text="404" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <GlitchText text="SYSTEM FAILURE // PAGE NOT FOUND" className="text-primary" />
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto font-mono text-sm leading-relaxed">
          The requested resource has been disconnected from the neural network. Please recalibrate
          your coordinates.
        </p>
      </div>
      <Link
        href="/"
        className="border-primary/50 hover:bg-primary/10 hover:text-primary mt-8 font-mono inline-flex items-center justify-center h-8 px-4 border rounded-none text-xs font-medium transition-all"
      >
        &lt; RETURN_TO_BASE /&gt;
      </Link>
    </div>
  );
}
