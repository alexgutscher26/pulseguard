"use client";

import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({ message, onConfirm, onCancel }: ConfirmationDialogProps) {
  return (
    <div className="p-4 border-t border-border bg-muted/50">
      <p className="text-sm text-foreground mb-3">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md",
            "bg-background border border-border",
            "hover:bg-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        >
          Cancel
          <kbd className="ml-2 text-xs text-muted-foreground">ESC</kbd>
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md",
            "bg-destructive text-destructive-foreground",
            "hover:bg-destructive/90 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        >
          Confirm
          <kbd className="ml-2 text-xs opacity-70">↵</kbd>
        </button>
      </div>
    </div>
  );
}
