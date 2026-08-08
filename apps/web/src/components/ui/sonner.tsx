"use client";

import "goey-toast/styles.css";

import { useTheme } from "next-themes";
import { GooeyToaster, gooeyToast } from "goey-toast";
import type { GooeyToasterProps } from "goey-toast";
import { useEffect, useState } from "react";

const Toaster = ({ ...props }: GooeyToasterProps) => {
  const [mounted, setMounted] = useState(false);
  const themeContext = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const theme = themeContext?.theme || "system";
  const isDark =
    theme === "dark" || theme === "matrix" || theme === "cyberpunk" || theme === "blade";

  return (
    <GooeyToaster
      position="bottom-right"
      theme={isDark ? "dark" : "light"}
      preset="snappy"
      showProgress
      {...props}
    />
  );
};

const toastFn = (title?: string | React.ReactNode, options?: any) => {
  return gooeyToast(String(title || ""), options);
};

toastFn.success = (title?: string | React.ReactNode, options?: any) => {
  return gooeyToast.success(String(title || ""), options);
};

toastFn.error = (title?: string | React.ReactNode, options?: any) => {
  return gooeyToast.error(String(title || "An error occurred"), options);
};

toastFn.warning = (title?: string | React.ReactNode, options?: any) => {
  return gooeyToast.warning(String(title || ""), options);
};

toastFn.info = (title?: string | React.ReactNode, options?: any) => {
  return gooeyToast.info(String(title || ""), options);
};

toastFn.loading = (title?: string | React.ReactNode, options?: any) => {
  return gooeyToast.info(String(title || "Loading..."), options);
};

toastFn.promise = gooeyToast.promise;
toastFn.dismiss = gooeyToast.dismiss;
toastFn.update = gooeyToast.update;

export { Toaster, gooeyToast, toastFn as toast };
