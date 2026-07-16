import type { Metadata } from "next";
import { SleepModeClient } from "./sleep-mode-client";

export const metadata: Metadata = {
  title: "Sleep Mode — PulseGuard",
  description:
    "False-positive prevention that lets solo devs sleep through the night. PulseGuard filters out 2-second blips so if we call you, it's real.",
  openGraph: {
    title: "Sleep Mode — PulseGuard",
    description:
      "Multi-vector verification, flapping detection, and dynamic thresholding. If PulseGuard calls you at 3 AM, it's a real outage.",
  },
};

export default function SleepModePage() {
  return (
    <div className="container mx-auto pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <SleepModeClient />
      </div>
    </div>
  );
}
