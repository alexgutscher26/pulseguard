"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function LiveStatusDemo() {
  const rows = [
    { width: "60%", delay: 0 },
    { width: "45%", delay: 0.1 },
    { width: "70%", delay: 0.2 },
    { width: "50%", delay: 0.3 },
  ];

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl h-[220px] w-full mb-6 relative overflow-hidden p-6 flex flex-col justify-center">
      {/* Lightning Pulse Icon - Top Right */}
      <div className="absolute top-4 right-4 size-10 rounded-full border border-white/10 flex items-center justify-center bg-[#151515]">
        <Activity className="size-5 text-primary" />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-2">
            <motion.div
              className="h-2 rounded-full bg-white/10"
              style={{ width: row.width }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: row.delay }}
            />
          </div>
        ))}
      </div>

      {/* The Active Scan / Highlight Item */}
      <motion.div
        className="absolute left-6 right-6 h-16 bg-primary/10 border border-primary/40 rounded-xl flex flex-col justify-center px-4 gap-2 shadow-[0_0_20px_rgba(57,255,20,0.1)]"
        initial={{ y: 0 }}
        animate={{
          y: [0, 52, 104, 52, 0], // Move between rows approx spacing
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <div className="w-[60%] h-2 rounded-full bg-primary/80" />
        <div className="w-[40%] h-2 rounded-full bg-primary/40" />

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary/5 rounded-xl blur-md -z-10" />
      </motion.div>

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
    </div>
  );
}
