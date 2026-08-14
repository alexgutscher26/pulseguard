"use client";

import { useCallback } from "react";
import useSound from "use-sound";

// Types corresponding to available assets
export type SoundType = "click" | "hover" | "success" | "error" | "glitch";

const SOUND_PATHS: Record<SoundType, string> = {
  click: "/sounds/click.mp3",
  hover: "/sounds/hover.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  glitch: "/sounds/glitch.mp3",
};

export function useSfx() {
  const [playClick] = useSound(SOUND_PATHS.click, { volume: 0.5 });
  const [playHover] = useSound(SOUND_PATHS.hover, { volume: 0.1 });
  const [playSuccess] = useSound(SOUND_PATHS.success, { volume: 0.5 });
  const [playError] = useSound(SOUND_PATHS.error, { volume: 0.6 });
  const [playGlitch] = useSound(SOUND_PATHS.glitch, { volume: 0.3 });

  const play = useCallback(
    (type: SoundType) => {
      // Check mute preference inside the callback to get latest value without re-rendering loop
      const isMuted = typeof window !== "undefined" && localStorage.getItem("sfx-muted") === "true";
      if (isMuted) return;

      switch (type) {
        case "click":
          playClick();
          break;
        case "hover":
          playHover();
          break;
        case "success":
          playSuccess();
          break;
        case "error":
          playError();
          break;
        case "glitch":
          playGlitch();
          break;
      }
    },
    [playClick, playHover, playSuccess, playError, playGlitch],
  );

  return { play };
}
