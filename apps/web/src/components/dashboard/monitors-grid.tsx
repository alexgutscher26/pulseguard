"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonitorGridCard } from "./monitor-grid-card";
import { LayoutGrid, Save, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: string;
  events: any[];
  interval: number;
}

interface MonitorsGridProps {
  monitors: Monitor[];
}

interface GridItemConfig {
  id: string;
  size: "1x1" | "2x1" | "2x2";
}

export function MonitorsGrid({ monitors }: MonitorsGridProps) {
  const [layout, setLayout] = useState<GridItemConfig[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Load layout from localStorage or generate default
  useEffect(() => {
    const savedLayout = localStorage.getItem("pulseguard_dashboard_grid_layout");
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout) as GridItemConfig[];
        // Filter out items that are no longer in monitors list, and add new ones
        const monitorIds = new Set(monitors.map((m) => m.id));
        const filtered = parsed.filter((item) => monitorIds.has(item.id));
        const existingIds = new Set(filtered.map((item) => item.id));

        const newItems: GridItemConfig[] = [];
        monitors.forEach((m) => {
          if (!existingIds.has(m.id)) {
            newItems.push({ id: m.id, size: "1x1" });
          }
        });

        setLayout([...filtered, ...newItems]);
      } catch (e) {
        console.error("Failed to parse saved grid layout:", e);
        generateDefaultLayout();
      }
    } else {
      generateDefaultLayout();
    }
  }, [monitors]);

  const generateDefaultLayout = () => {
    const defaultLayout = monitors.map((m) => ({
      id: m.id,
      size: "1x1" as const,
    }));
    setLayout(defaultLayout);
  };

  const saveLayout = (newLayout: GridItemConfig[]) => {
    localStorage.setItem("pulseguard_dashboard_grid_layout", JSON.stringify(newLayout));
  };

  const handleResize = (id: string, size: "1x1" | "2x1" | "2x2") => {
    const updated = layout.map((item) => (item.id === id ? { ...item, size } : item));
    setLayout(updated);
    saveLayout(updated);
  };

  const handleReset = () => {
    generateDefaultLayout();
    localStorage.removeItem("pulseguard_dashboard_grid_layout");
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    if (!isEditMode) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !isEditMode) return;

    // Reorder items in state to animate via framer-motion layout prop
    const reordered = [...layout];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setLayout(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    saveLayout(layout);
  };

  // Map configuration back to full monitor data
  const monitorMap = new Map(monitors.map((m) => [m.id, m]));
  const orderedItems = layout
    .map((item) => ({
      config: item,
      data: monitorMap.get(item.id),
    }))
    .filter((item) => item.data !== undefined); // Exclude missing data

  return (
    <div className="flex flex-col gap-6">
      {/* Grid Controller Toolbar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Operational Matrix Grid
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 font-mono text-[10px] uppercase tracking-wider"
            >
              <RotateCcw className="size-3 mr-1.5" />
              Reset Layout
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`h-8 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              isEditMode
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
            }`}
          >
            {isEditMode ? (
              <>
                <Save className="size-3 mr-1.5" />
                Done Configuring
              </>
            ) : (
              "Configure Layout"
            )}
          </Button>
        </div>
      </div>

      {isEditMode && (
        <div className="flex items-center gap-2 p-3.5 border border-primary/10 bg-primary/5 rounded-lg">
          <AlertCircle className="size-4 text-primary shrink-0" />
          <p className="text-xs text-primary/80 font-mono">
            DRAG handles to rearrange nodes. Click RESIZE controls inside cards to resize grids.
          </p>
        </div>
      )}

      {/* Responsive Custom Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        <AnimatePresence mode="popLayout">
          {orderedItems.map(({ config, data }, index) => (
            <motion.div
              key={config.id}
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              draggable={isEditMode}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative ${isEditMode ? "cursor-grab active:cursor-grabbing" : ""} ${
                config.size === "1x1"
                  ? "col-span-1"
                  : config.size === "2x1"
                    ? "col-span-1 md:col-span-2"
                    : "col-span-1 md:col-span-2 row-span-2"
              }`}
            >
              <MonitorGridCard
                monitor={data}
                size={config.size}
                onResize={(size) => handleResize(config.id, size)}
                isEditMode={isEditMode}
                dragHandleProps={{
                  draggable: isEditMode,
                  onDragStart: (e: any) => {
                    e.stopPropagation();
                    handleDragStart(index);
                  },
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {orderedItems.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
              No nodes detected in layout matrix.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
