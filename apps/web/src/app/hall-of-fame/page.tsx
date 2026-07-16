import type { Metadata } from "next";
import LandingHeader from "@/components/landing/header";
import LandingFooter from "@/components/landing/footer";
import { HallOfFameClient } from "./hall-of-fame-client";
import { getLeaderboard } from "@/actions/leaderboard";

export const metadata: Metadata = {
  title: "Community Hall of Fame | PulseGuard",
  description:
    "Meet the indie hackers and teams with the highest uptime SLAs on PulseGuard. Powered by relentless monitoring.",
  openGraph: {
    title: "PulseGuard Community Hall of Fame",
    description: "Top-tier uptime performers ranked by SLA.",
  },
};

export default async function HallOfFamePage() {
  const leaderboard = await getLeaderboard(100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />
      <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <HallOfFameClient initialEntries={leaderboard} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
