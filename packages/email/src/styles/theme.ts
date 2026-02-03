export const emailTheme = {
  colors: {
    background: "#050505",
    foreground: "#e0e0e0",
    card: "#0a0a0a",
    primary: "#39ff14",
    primaryForeground: "#000000",
    destructive: "#ff3333",
    border: "#333333",
    muted: "#666666",
  },
  fonts: {
    mono: '"Courier New", Courier, monospace',
    sans: "system-ui, -apple-system, sans-serif",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: "0px", // Brutalist sharp edges
} as const;

export type EmailTheme = typeof emailTheme;
