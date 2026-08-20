"use client";

import { useCallback } from "react";

type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "error";

/**
 * Hook to trigger haptic feedback on mobile devices using navigator.vibrate
 */
export function useHaptic() {
  const trigger = useCallback((type: HapticType = "light") => {
    // Check if vibration is supported
    if (typeof navigator === "undefined" || !navigator.vibrate) return;

    switch (type) {
      case "light":
        navigator.vibrate(10); // Subtle tick
        break;
      case "medium":
        navigator.vibrate(40); // Standard tap
        break;
      case "heavy":
        navigator.vibrate(70); // Firm bump
        break;
      case "success":
        navigator.vibrate([10, 30, 10]); // Three quick ticks
        break;
      case "warning":
        navigator.vibrate([30, 10, 30]); // Two bumps
        break;
      case "error":
        navigator.vibrate([50, 50, 50]); // Three long bumps
        break;
      default:
        navigator.vibrate(10);
    }
  }, []);

  return { trigger };
}
