"use client";

import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { CommandItem } from "../command-item";
import { useCommandPalette } from "../use-command-palette";
import { Edit, CheckCircle } from "lucide-react";
import { getMonitors } from "@/actions/monitors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MonitorCommands() {
  const router = useRouter();
  const { close } = useCommandPalette();

  // Fetch monitors
  const { data: monitors } = useQuery({
    queryKey: ["monitors"],
    queryFn: getMonitors,
  });

  if (!monitors || monitors.length === 0) return null;

  return (
    <>
      {/* Global Monitor Actions */}
      <Command.Group heading="Monitor Actions">
        <CommandItem
          icon={CheckCircle}
          label="Acknowledge All Alerts"
          onSelect={() => {
            toast.info("Acknowledge all alerts - Coming soon!");
            close();
          }}
        />
      </Command.Group>

      {/* Individual Monitor Actions */}
      {monitors.slice(0, 5).map((monitor) => (
        <Command.Group key={monitor.id} heading={monitor.name}>
          <CommandItem
            icon={Edit}
            label="Edit Monitor"
            onSelect={() => {
              router.push(`/dashboard/monitors/${monitor.id}?tab=settings`);
              close();
            }}
          />
        </Command.Group>
      ))}
    </>
  );
}
