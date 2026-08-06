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

const TOTAL_PARTNER_SPOTS = 15;
const DESIGN_PARTNER_IDENTIFIER = "design_partner_application";

export async function getDesignPartnerSpots(): Promise<DesignPartnerSpotsInfo> {
  try {
    const claimedSpots = await prisma.verification.count({
      where: { identifier: DESIGN_PARTNER_IDENTIFIER },
    });
    const remainingSpots = Math.max(1, TOTAL_PARTNER_SPOTS - claimedSpots);

    return {
      totalSpots: TOTAL_PARTNER_SPOTS,
      claimedSpots,
      remainingSpots,
    };
  } catch (error) {
    console.error("Failed to query design partner spots from DB:", error);
    return {
      totalSpots: TOTAL_PARTNER_SPOTS,
      claimedSpots: 0,
      remainingSpots: TOTAL_PARTNER_SPOTS,
    };
  }
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

    // Persist application in Prisma database
    try {
      await prisma.verification.create({
        data: {
          id: `dp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          identifier: DESIGN_PARTNER_IDENTIFIER,
          value: JSON.stringify({
            ...parsed,
            vipCode,
            userId: session?.user?.id || null,
            timestamp: new Date().toISOString(),
          }),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      });
    } catch (dbSaveErr) {
      console.warn("Could not save design partner application record to DB:", dbSaveErr);
    }

    // If user is currently logged in, upgrade user tier to NETRUNNER (Pro)
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

    // Query fresh remaining spots count from database
    const spotsInfo = await getDesignPartnerSpots();

    console.log(`[DesignPartner] Application Accepted:`, {
      ...parsed,
      vipCode,
      remainingSpots: spotsInfo.remainingSpots,
      userId: session?.user?.id || "guest",
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      vipCode,
      remainingSpots: spotsInfo.remainingSpots,
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
