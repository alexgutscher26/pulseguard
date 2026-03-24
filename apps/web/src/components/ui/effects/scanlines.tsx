"use client";

import { useEffect, useState } from "react";

export function Scanlines() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden">
      {/* Static Scanlines */}
      <div className="absolute inset-0 z-50 h-full w-full scanlines opacity-50" />

      {/* Moving Scanline Bar */}
      <div className="absolute inset-0 z-50 h-[200%] w-full animate-scan bg-[linear-gradient(to_bottom,transparent,rgba(var(--primary),0.1)_50%,transparent)] opacity-30" />

      {/* Vignette */}
      <div className="absolute inset-0 z-50 h-full w-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
