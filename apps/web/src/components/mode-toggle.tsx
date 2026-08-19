"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Renders a theme toggle dropdown menu.
 */
export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const themeContext = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="cursor-pointer">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const setTheme = themeContext?.setTheme || (() => {});

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id="mode-toggle-trigger"
        render={
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Obsidian Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("matrix")}>
          <Monitor className="mr-2 h-4 w-4 text-[#38bdf8]" /> Midnight Slate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("cyberpunk")}>
          <Moon className="mr-2 h-4 w-4 text-[#f97316]" /> Carbon Ember
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blade")}>
          <Moon className="mr-2 h-4 w-4 text-[#10b981]" /> Nordic Emerald
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Clean Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
