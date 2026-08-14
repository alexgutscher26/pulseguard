"use client";

import { Check, Square, CheckSquare } from "lucide-react";

interface Monitor {
  id: string;
  monitorId: string;
  displayName: string | null;
  monitor: {
    id: string;
    name: string;
  };
}

interface MonitorSelectorProps {
  monitors: Monitor[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function MonitorSelector({
  monitors,
  selectedIds,
  onChange,
}: MonitorSelectorProps) {
  const allSelected = selectedIds.length === monitors.length;
  const noneSelected = selectedIds.length === 0;

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(monitors.map((m) => m.monitorId));
    }
  };

  const toggleMonitor = (monitorId: string) => {
    if (selectedIds.includes(monitorId)) {
      onChange(selectedIds.filter((id) => id !== monitorId));
    } else {
      onChange([...selectedIds, monitorId]);
    }
  };

  return (
    <div className="border border-primary/20 rounded-md overflow-hidden bg-black/30">
      {/* Select All Header */}
      <button
        type="button"
        onClick={toggleAll}
        className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors border-b border-primary/10"
      >
        <div
          className={`size-5 rounded flex items-center justify-center border ${
            allSelected
              ? "bg-primary/20 border-primary text-primary"
              : "border-primary/30 text-primary/30"
          }`}
        >
          {allSelected && <Check className="size-3" />}
        </div>
        <span className="text-sm font-medium text-primary/80">
          {allSelected ? "Deselect All" : "Select All"}
        </span>
        <span className="ml-auto text-xs text-primary/40">
          {selectedIds.length}/{monitors.length}
        </span>
      </button>

      {/* Monitor List */}
      <div className="max-h-48 overflow-y-auto">
        {monitors.map((item) => {
          const isSelected = selectedIds.includes(item.monitorId);
          const name = item.displayName || item.monitor.name;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleMonitor(item.monitorId)}
              className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors border-b border-primary/10 last:border-b-0"
            >
              <div
                className={`size-5 rounded flex items-center justify-center border transition-colors ${
                  isSelected
                    ? "bg-primary/20 border-primary text-primary"
                    : "border-primary/30 text-transparent hover:border-primary/50"
                }`}
              >
                <Check className="size-3" />
              </div>
              <span
                className={`text-sm font-mono truncate ${
                  isSelected ? "text-primary" : "text-primary/50"
                }`}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {monitors.length === 0 && (
        <div className="p-4 text-center text-primary/40 text-sm">
          No monitors available
        </div>
      )}
    </div>
  );
}
