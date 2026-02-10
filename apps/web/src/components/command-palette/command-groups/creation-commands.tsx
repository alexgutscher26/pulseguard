"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { CommandItem } from "../command-item";
import { useCommandPalette } from "../use-command-palette";
import { Plus, Globe, Wifi, Network, Server } from "lucide-react";

export function CreationCommands() {
  const router = useRouter();
  const { close } = useCommandPalette();

  const createMonitor = (type: string) => {
    router.push(`/dashboard/monitors/new?type=${type}`);
    close();
  };

  return (
    <Command.Group heading="Create">
      <CommandItem
        icon={Globe}
        label="Create HTTP Monitor"
        shortcut="⌘N"
        onSelect={() => createMonitor("http")}
      />
      <CommandItem icon={Wifi} label="Create Ping Monitor" onSelect={() => createMonitor("ping")} />
      <CommandItem
        icon={Network}
        label="Create TCP Monitor"
        onSelect={() => createMonitor("tcp")}
      />
      <CommandItem icon={Server} label="Create DNS Monitor" onSelect={() => createMonitor("dns")} />
    </Command.Group>
  );
}
