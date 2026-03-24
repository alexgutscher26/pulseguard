"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  as?: any;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "p" | "span";
}

export function GlitchText({ text, as: Component = "span", className }: GlitchTextProps) {
  return (
    <Component className={cn("relative inline-block group", className)} data-text={text}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 -ml-[2px] text-primary opacity-0 group-hover:opacity-100 animate-glitch-1"
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 ml-[2px] text-secondary opacity-0 group-hover:opacity-100 animate-glitch-2"
        aria-hidden="true"
      >
        {text}
      </span>
    </Component>
  );
}
