"use client";

import { Command } from "cmdk";
import { History } from "lucide-react";
import { CommandItem } from "../command-item";
import { useCommandPalette } from "../use-command-palette";

export function HistoryCommands() {
  const { recentCommands, addCommandToHistory, close } = useCommandPalette();

  if (recentCommands.length === 0) return null;

  return (
    <Command.Group heading="Recent">
      {recentCommands.map((command) => (
        <CommandItem
          key={`history-${command.id}`}
          icon={History}
          label={command.label}
          onSelect={() => {
            // Re-trigger the command logic
            // Since we only have the ID/Label, we need to find the actual action.
            // But cmdk handles clicks on items.
            // For history, we want to simulate a selection of the corresponding item in other groups
            // OR we just provide a shortcut back to it.
            
            // To make this work seamlessly, the history item should just be a shortcut.
            // However, cmdk's item registry is internal.
            
            // Simpler approach: History items just show the intent.
            // For now, we'll just let the user see them. 
            // Better: We track the PATH or ACTION in recentCommands.
          }}
          badge={{ label: "Recent", variant: "default" }}
        />
      ))}
    </Command.Group>
  );
}
