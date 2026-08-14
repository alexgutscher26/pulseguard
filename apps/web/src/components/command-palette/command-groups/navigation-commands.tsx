"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CommandItem } from "../command-item";
import { useCommandPalette } from "../use-command-palette";
import {
  Home,
  Activity,
  AlertTriangle,
  Settings,
  CreditCard,
  Globe,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { getMonitors } from "@/actions/monitors";

export function NavigationCommands() {
  const router = useRouter();
  const { close } = useCommandPalette();

  // Fetch monitors for navigation
  const { data: monitors, isLoading } = useQuery({
    queryKey: ["monitors"],
    queryFn: getMonitors,
  });

  const navigate = (path: string) => {
    router.push(path as any);
    close();
  };

  return (
    <>
      {/* Main Navigation */}
      <Command.Group heading="Navigation">
        <CommandItem icon={Home} label="Go to Dashboard" onSelect={() => navigate("/dashboard")} />
        <CommandItem
          icon={Activity}
          label="Go to Monitors"
          onSelect={() => navigate("/dashboard/monitors")}
        />
        <CommandItem
          icon={AlertTriangle}
          label="Go to Incidents"
          onSelect={() => navigate("/dashboard/incidents")}
        />
        <CommandItem
          icon={Settings}
          label="Go to Settings"
          onSelect={() => navigate("/dashboard/settings")}
        />
        <CommandItem
          icon={CreditCard}
          label="Go to Billing"
          onSelect={() => navigate("/dashboard/billing")}
        />
        <CommandItem
          icon={Globe}
          label="Go to Status Page"
          onSelect={() => navigate("/dashboard/status-page")}
        />
      </Command.Group>

      {/* Monitor Navigation */}
      {isLoading ? (
        <Command.Group heading="Monitors">
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading monitors...</span>
          </div>
        </Command.Group>
      ) : monitors && monitors.length > 0 ? (
        <Command.Group heading="Monitors">
          {monitors.slice(0, 5).map((monitor) => (
            <CommandItem
              key={monitor.id}
              icon={ArrowRight}
              label={`Go to ${monitor.name}`}
              badge={{
                label: monitor.status === "UP" ? "Up" : "Down",
                variant: monitor.status === "UP" ? "success" : "danger",
              }}
              onSelect={() => navigate(`/dashboard/monitors/${monitor.id}`)}
            />
          ))}
          {monitors.length > 5 && (
            <div className="px-4 py-2 text-xs text-muted-foreground">
              + {monitors.length - 5} more monitors
            </div>
          )}
        </Command.Group>
      ) : null}
    </>
  );
}
