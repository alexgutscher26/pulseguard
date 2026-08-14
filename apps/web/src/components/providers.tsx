"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

import { queryClient } from "@/utils/trpc";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

/**
 * A component that provides theme and query context to its children.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark", "matrix", "cyberpunk", "blade"]}
      >
        {children}
        {mounted && <Toaster />}
        {mounted && process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
