"use server";

import { z } from "zod";
import prisma from "@pulseguard/db";
import { headers } from "next/headers";
import { auth } from "@pulseguard/auth";

const designPartnerSchema = z.object({
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

export interface DesignPartnerRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  website: string;
  monitorsCount: string;
  currentTool: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  vipCode?: string;
  userId?: string | null;
  createdAt: string;
}

export interface DesignPartnerResponse {
  success: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED";
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

/**
 * Get count of APPROVED spots remaining
 */
export async function getDesignPartnerSpots(): Promise<DesignPartnerSpotsInfo> {
  try {
    const records = await prisma.verification.findMany({
      where: { identifier: DESIGN_PARTNER_IDENTIFIER },
    });

    let approvedCount = 0;
    for (const record of records) {
      try {
        const data = JSON.parse(record.value);
        if (data.status === "APPROVED") {
          approvedCount++;
        }
      } catch {}
    }

    const remainingSpots = Math.max(1, TOTAL_PARTNER_SPOTS - approvedCount);

    return {
      totalSpots: TOTAL_PARTNER_SPOTS,
      claimedSpots: approvedCount,
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

/**
 * Submit a new Design Partner application (Status defaults to PENDING under review)
 */
export async function submitDesignPartnerApplication(
  input: DesignPartnerInput,
): Promise<DesignPartnerResponse> {
  try {
    const parsed = designPartnerSchema.parse(input);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const recordId = `dp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const payload: DesignPartnerRecord = {
      id: recordId,
      name: parsed.name,
      email: parsed.email,
      company: parsed.company,
      website: parsed.website,
      monitorsCount: parsed.monitorsCount,
      currentTool: parsed.currentTool,
      status: "PENDING",
      userId: session?.user?.id || null,
      createdAt: new Date().toISOString(),
    };

    // Persist PENDING application in Prisma database
    await prisma.verification.create({
      data: {
        id: recordId,
        identifier: DESIGN_PARTNER_IDENTIFIER,
        value: JSON.stringify(payload),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    const spotsInfo = await getDesignPartnerSpots();

    console.log(`[DesignPartner] New Application Submitted (PENDING):`, payload);

    return {
      success: true,
      status: "PENDING",
      remainingSpots: spotsInfo.remainingSpots,
      message:
        "Application submitted successfully! Our founding team will review your application within 24 hours.",
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

/**
 * Fetch all design partner applications for admin review
 */
export async function getAllDesignPartnerApplications(): Promise<DesignPartnerRecord[]> {
  try {
    const records = await prisma.verification.findMany({
      where: { identifier: DESIGN_PARTNER_IDENTIFIER },
      orderBy: { createdAt: "desc" },
    });

    const list: DesignPartnerRecord[] = [];
    for (const r of records) {
      try {
        const data = JSON.parse(r.value);
        list.push({
          id: r.id,
          name: data.name || "Unknown",
          email: data.email || "",
          company: data.company || "Indie / Personal",
          website: data.website || "",
          monitorsCount: data.monitorsCount || "10-50",
          currentTool: data.currentTool || "UptimeRobot",
          status: data.status || "PENDING",
          vipCode: data.vipCode,
          userId: data.userId,
          createdAt: data.createdAt || r.createdAt.toISOString(),
        });
      } catch {}
    }

    return list;
  } catch (error) {
    console.error("Failed to fetch design partner applications:", error);
    return [];
  }
}

import { getAdminStatus } from "./admin";

/**
 * Approve a pending design partner application (Requires Admin role)
 */
export async function approveDesignPartnerApplication(
  id: string,
): Promise<{ success: boolean; vipCode?: string; error?: string }> {
  try {
    const admin = await getAdminStatus();
    if (!admin.isAdmin) {
      return {
        success: false,
        error: "Unauthorized: Admin access required to approve design partners",
      };
    }

    const record = await prisma.verification.findUnique({
      where: { id },
    });

    if (!record) {
      return { success: false, error: "Application not found" };
    }

    const data: DesignPartnerRecord = JSON.parse(record.value);
    const vipCode = data.vipCode || generateVipCode();

    data.status = "APPROVED";
    data.vipCode = vipCode;

    // Update database verification record
    await prisma.verification.update({
      where: { id },
      data: {
        value: JSON.stringify(data),
      },
    });

    // If there is an associated user, upgrade their tier to NETRUNNER (Pro)
    if (data.userId) {
      try {
        await prisma.user.update({
          where: { id: data.userId },
          data: { tier: "NETRUNNER" },
        });
      } catch (err) {
        console.warn("Failed to upgrade user tier on approval:", err);
      }
    }

    console.log(`[DesignPartner] Application APPROVED for ${data.email}. VIP Code: ${vipCode}`);

    return {
      success: true,
      vipCode,
    };
  } catch (error: any) {
    console.error("Failed to approve application:", error);
    return { success: false, error: error.message || "Failed to approve application" };
  }
}

/**
 * Reject a design partner application (Requires Admin role)
 */
export async function rejectDesignPartnerApplication(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getAdminStatus();
    if (!admin.isAdmin) {
      return {
        success: false,
        error: "Unauthorized: Admin access required to reject design partners",
      };
    }

    const record = await prisma.verification.findUnique({
      where: { id },
    });

    if (!record) {
      return { success: false, error: "Application not found" };
    }

    const data: DesignPartnerRecord = JSON.parse(record.value);
    data.status = "REJECTED";

    await prisma.verification.update({
      where: { id },
      data: {
        value: JSON.stringify(data),
      },
    });

    console.log(`[DesignPartner] Application REJECTED for ${data.email}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject application:", error);
    return { success: false, error: error.message || "Failed to reject application" };
  }
}
