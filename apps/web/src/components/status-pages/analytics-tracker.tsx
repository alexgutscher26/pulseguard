"use client";

import { useEffect, useRef } from "react";
import { recordStatusPageView } from "@/actions/analytics";

export function AnalyticsTracker({ pageId }: { pageId: string }) {
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    // Fire and forget logging
    recordStatusPageView(pageId);
  }, [pageId]);

  return null;
}
