"use server";

import { z } from "zod";
import prisma from "@pulseguard/db";
import { headers } from "next/headers";
import { auth } from "@pulseguard/auth";

export const designPartnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email"),
  company: z.string().optional().default("Indie / Personal"),
  website: z.string().url("Please enter a valid URL (e.g. https://yourcompany.com)"),
  monitorsCount: z.string().default("10-50"),
  currentTool: z.string().default("UptimeRobot"),
  feedbackCommitment: z.boolean().refine((val) => val === true, {
    message: "You must agree to the feedback commitment to join",
  }),
});

export type DesignPartnerInput = z.infer<typeof designPartnerSchema>;

export interface DesignPartnerResponse {
  success: boolean;
  vipCode?: string;
  remainingSpots?: number;
  message?: string;
  error?: string;
}

export interface DesignPartnerSpotsInfo {
  totalSpots: number;
  claimedSpots: number;
  remainingSpots: number;
}

// In-memory application counter initialized to 4 claimed (11 remaining out of 15)
let globalClaimedApplications = 4;
const TOTAL_PARTNER_SPOTS = 15;

export async function getDesignPartnerSpots(): Promise<DesignPartnerSpotsInfo> {
  const remainingSpots = Math.max(1, TOTAL_PARTNER_SPOTS - globalClaimedApplications);
  return {
    totalSpots: TOTAL_PARTNER_SPOTS,
    claimedSpots: globalClaimedApplications,
    remainingSpots,
  };
}

function generateVipCode(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VIP-PARTNER-2026-${hex}`;
}

export async function submitDesignPartnerApplication(
  input: DesignPartnerInput
): Promise<DesignPartnerResponse> {
  try {
    const parsed = designPartnerSchema.parse(input);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const vipCode = generateVipCode();

    // Increment global claimed application count
    globalClaimedApplications += 1;
    const remainingSpots = Math.max(1, TOTAL_PARTNER_SPOTS - globalClaimedApplications);

    // If user is currently logged in, upgrade user or log design partner status
    if (session?.user?.id) {
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            tier: "NETRUNNER", // Grant Pro tier access for Design Partners
          },
        });
      } catch (dbErr) {
        console.warn("Could not update user tier directly in DB:", dbErr);
      }
    }

    console.log(`[DesignPartner] New Application Received:`, {
      ...parsed,
      vipCode,
      remainingSpots,
      userId: session?.user?.id || "guest",
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      vipCode,
      remainingSpots,
      message: "Application accepted! Your 1-year Netrunner Pro access code has been generated.",
    };
  } catch (error: any) {
    console.error("Failed to submit design partner application:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
      };
    }
    return {
      success: false,
      error: error.message || "Failed to process application. Please try again.",
    };
  }
}
