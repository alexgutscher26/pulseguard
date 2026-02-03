"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPreferences } from "@/actions/user";

export function useUserPreferences() {
  return useQuery({
    queryKey: ["user-preferences"],
    queryFn: () => getUserPreferences(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
