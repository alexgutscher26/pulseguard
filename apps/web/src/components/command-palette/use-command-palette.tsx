"use client";

import { create } from "zustand";

interface CommandPaletteStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  // Confirmation state for destructive actions
  pendingAction: (() => Promise<void>) | null;
  confirmationMessage: string | null;
  setPendingAction: (action: (() => Promise<void>) | null, message?: string) => void;
  executePendingAction: () => Promise<void>;
  cancelPendingAction: () => void;
}

export const useCommandPalette = create<CommandPaletteStore>((set, get) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, pendingAction: null, confirmationMessage: null }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  pendingAction: null,
  confirmationMessage: null,

  setPendingAction: (action, message = "Are you sure you want to perform this action?") => {
    set({ pendingAction: action, confirmationMessage: message });
  },

  executePendingAction: async () => {
    const { pendingAction } = get();
    if (pendingAction) {
      await pendingAction();
      set({ pendingAction: null, confirmationMessage: null });
    }
  },

  cancelPendingAction: () => {
    set({ pendingAction: null, confirmationMessage: null });
  },
}));

// Hook for keyboard shortcut
export function useCommandPaletteKeyboard() {
  const { toggle } = useCommandPalette();

  if (typeof window === "undefined") return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      toggle();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }
}
