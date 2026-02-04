"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MapPoint {
  region: string;
  city: string;
  coordinates: [number, number]; // [long, lat]
  status: "UP" | "DOWN" | "PENDING";
  latency?: number;
}

interface WorldMapProps {
  points: MapPoint[];
  className?: string;
}

export function WorldMap({ points, className }: WorldMapProps) {
  // Convert Lat/Long to % positions
  // Equirectangular projection:
  // x = (lon + 180) / 360 * 100
  // y = (90 - lat) / 180 * 100
  const getPosition = (lon: number, lat: number) => ({
    x: ((lon + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });

  return (
    <div
      className={cn(
        "relative w-full aspect-2/1 bg-muted/20 rounded-xl overflow-hidden shadow-inner border border-border/50",
        className,
      )}
    >
      {/* Abstract World Utils via Background Image or CSS if available, 
          but for now we use a tech-grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[4%_8%]" />

      {/* Decorative 'Scanline' */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.5)] z-0"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Map Points */}
      {points.map((point) => {
        const { x, y } = getPosition(
          point.coordinates[0],
          point.coordinates[1],
        );

        // Color coding
        let colorClass = "bg-primary";
        let shadowClass = "shadow-[0_0_10px_var(--primary)]";

        if (point.status === "DOWN") {
          colorClass = "bg-red-500";
          shadowClass = "shadow-[0_0_10px_red]";
        } else if (point.latency && point.latency > 500) {
          colorClass = "bg-yellow-500";
          shadowClass = "shadow-[0_0_10px_yellow]";
        } else if (point.status === "UP") {
          colorClass = "bg-green-500";
          shadowClass = "shadow-[0_0_10px_green]";
        }

        return (
          <div
            key={point.region}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* Pulse Effect */}
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute w-3 h-3 rounded-full ${colorClass}`}
            />

            {/* Core Dot */}
            <div
              className={`relative w-2 h-2 rounded-full ${colorClass} ${shadowClass}`}
            />

            {/* Tooltip Label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap z-10 pointer-events-none">
              <span className="font-bold">{point.city}</span>
              {point.latency && (
                <span className="ml-1 text-muted-foreground">
                  ({point.latency}ms)
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
