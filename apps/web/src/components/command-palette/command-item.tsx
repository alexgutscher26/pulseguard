"use client";

import { Command } from "cmdk";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useCommandPalette } from "./use-command-palette";

interface CommandItemProps {
  id?: string;
  icon?: LucideIcon;
  label: string;
  shortcut?: string;
  onSelect: () => void;
  badge?: {
    label: string;
    variant: "success" | "danger" | "warning" | "default";
  };
}

export function CommandItem({
  id,
  icon: Icon,
  label,
  shortcut,
  onSelect,
  badge,
}: CommandItemProps) {
  const { addCommandToHistory } = useCommandPalette();

  const handleSelect = () => {
    addCommandToHistory(id || label, label);
    onSelect();
  };

  return (
    <Command.Item
      onSelect={handleSelect}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer",
        "text-sm text-foreground",
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
        "transition-colors rounded-md mx-2",
      )}
    >
      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}

      <span className="flex-1">{label}</span>

      {badge && (
        <span
          className={cn(
            "px-2 py-0.5 text-xs rounded-full font-medium",
            badge.variant === "success" && "bg-green-500/10 text-green-500",
            badge.variant === "danger" && "bg-red-500/10 text-red-500",
            badge.variant === "warning" && "bg-yellow-500/10 text-yellow-500",
            badge.variant === "default" && "bg-muted text-muted-foreground",
          )}
        >
          {badge.label}
        </span>
      )}

      {shortcut && (
        <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
