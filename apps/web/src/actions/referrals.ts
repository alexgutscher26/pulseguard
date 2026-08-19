"use server";

import { auth } from "@steadystack/auth";
import db from "@steadystack/db";
import { headers } from "next/headers";

export interface ReferredUserItem {
  id: string;
  maskedEmail: string;
  status: "PENDING" | "CONVERTED" | "REWARDED" | string;
  rewardAmount: number;
  createdAt: string;
}

export interface ReferralSummary {
  code: string;
  referralLink: string;
  clicks: number;
  totalReferred: number;
  totalConverted: number;
  totalEarned: number;
  referrals: ReferredUserItem[];
}

function generateRandomCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "pg_";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "user***@domain.com";
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

async function getReferralDb() {
  return db as any;
}

/**
 * Gets or creates referral summary details for the authenticated user.
 */
export async function getReferralSummary(): Promise<ReferralSummary> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const client = await getReferralDb();
  let referralCodeRecord: any = null;

  if (client.referralCode) {
    try {
      referralCodeRecord = await client.referralCode.findUnique({
        where: { userId },
        include: {
          referrals: {
            include: {
              referredUser: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch {}
  }

  if (!referralCodeRecord && client.referralCode) {
    const code = generateRandomCode();
    try {
      referralCodeRecord = await client.referralCode.create({
        data: {
          userId,
          code,
        },
        include: {
          referrals: {
            include: {
              referredUser: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch {
      try {
        referralCodeRecord = await client.referralCode.findUnique({
          where: { userId },
          include: {
            referrals: {
              include: {
                referredUser: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        });
      } catch {}
    }
  }

  if (!referralCodeRecord) {
    referralCodeRecord = {
      code: `pg_${userId.slice(-6)}`,
      clicks: 0,
      referrals: [],
    };
  }

  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const referralLink = `${protocol}://${host}/signup?ref=${referralCodeRecord.code}`;

  const referralsList: ReferredUserItem[] = (referralCodeRecord.referrals || []).map((r: any) => ({
    id: r.id,
    maskedEmail: r.referredUser?.email ? maskEmail(r.referredUser.email) : "referred_user",
    status: r.status,
    rewardAmount: r.rewardAmount || 10.0,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));

  const totalConverted = referralsList.filter(
    (r) => r.status === "CONVERTED" || r.status === "REWARDED",
  ).length;
  const totalEarned = referralsList
    .filter((r) => r.status === "CONVERTED" || r.status === "REWARDED")
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  return {
    code: referralCodeRecord.code,
    referralLink,
    clicks: referralCodeRecord.clicks || 0,
    totalReferred: referralsList.length,
    totalConverted,
    totalEarned,
    referrals: referralsList,
  };
}

/**
 * Tracks a referral link click.
 */
export async function trackReferralClick(code: string): Promise<void> {
  if (!code) return;
  try {
    const client = await getReferralDb();
    if (client.referralCode) {
      await client.referralCode.update({
        where: { code },
        data: { clicks: { increment: 1 } },
      });
    }
  } catch (err) {
    console.error("Error tracking referral click:", err);
  }
}

/**
 * Ensures a referral code exists for a given user ID and returns it.
 */
export async function ensureUserReferralCode(userId: string): Promise<string> {
  if (!userId) return "steadystack";
  try {
    const client = await getReferralDb();
    if (!client.referralCode) return `pg_${userId.slice(-6)}`;

    let record = await client.referralCode.findUnique({
      where: { userId },
      select: { code: true },
    });

    if (!record) {
      const code = generateRandomCode();
      try {
        record = await client.referralCode.create({
          data: { userId, code },
          select: { code: true },
        });
      } catch {
        record = await client.referralCode.findUnique({
          where: { userId },
          select: { code: true },
        });
      }
    }

    return record?.code || `pg_${userId.slice(-6)}`;
  } catch (err) {
    console.error("Error ensuring referral code:", err);
    return `pg_${userId.slice(-6)}`;
  }
}

/**
 * Records a referral when a newly registered user signs up with a referral code.
 */
export async function recordReferralSignup(
  code: string,
  newUserId?: string,
  userEmail?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!code) return { success: false, error: "Missing referral code" };

  try {
    const client = await getReferralDb();
    if (!client.referralCode || !client.referral) {
      return { success: true };
    }

    let referralCodeRecord = await client.referralCode.findUnique({
      where: { code },
      select: { id: true, userId: true },
    });

    // If code not explicitly found but matches a valid user, auto-provision the code record
    if (!referralCodeRecord && code.startsWith("pg_")) {
      const suffix = code.replace("pg_", "");
      const possibleUser = await client.user.findFirst({
        where: { id: { endsWith: suffix } },
        select: { id: true },
      });
      if (possibleUser) {
        try {
          referralCodeRecord = await client.referralCode.create({
            data: { userId: possibleUser.id, code },
            select: { id: true, userId: true },
          });
        } catch {
          referralCodeRecord = await client.referralCode.findUnique({
            where: { code },
            select: { id: true, userId: true },
          });
        }
      }
    }

    if (!referralCodeRecord) {
      return { success: false, error: "Referral code not found" };
    }

    // Determine the new user's ID from argument, email, or session
    let targetUserId = newUserId;

    if (!targetUserId && userEmail) {
      const userRecord = await client.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });
      if (userRecord?.id) {
        targetUserId = userRecord.id;
      }
    }

    if (!targetUserId) {
      try {
        const session = await auth.api.getSession({
          headers: await headers(),
        });
        targetUserId = session?.user?.id;
      } catch {}
    }

    if (!targetUserId) {
      return { success: false, error: "User not authenticated" };
    }

    // A user cannot refer themselves
    if (targetUserId === referralCodeRecord.userId) {
      return { success: false, error: "Self-referral is not allowed" };
    }

    // Check if the user is already referred
    const existing = await client.referral.findUnique({
      where: { referredUserId: targetUserId },
    });

    if (existing) {
      return { success: true };
    }

    await client.referral.create({
      data: {
        referralCodeId: referralCodeRecord.id,
        referredUserId: targetUserId,
        status: "PENDING",
        rewardAmount: 10.0,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error recording referral signup:", err);
    return { success: false, error: err?.message || "Failed to record referral" };
  }
}

export interface StatusPageLoopMetrics {
  statusPageViews: number;
  referralClicks: number;
  totalSignups: number;
  conversionRate: number;
  referralCode: string;
  referralUrl: string;
}

/**
 * Computes status page loop metrics (views, badge clicks, referred signups, conversion rate).
 */
export async function getStatusPageLoopMetrics(
  pageId: string,
  slug: string,
): Promise<StatusPageLoopMetrics> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const client = await getReferralDb();
  let statusPageViews = 0;
  let referralClicks = 0;
  let totalSignups = 0;
  let code = `pg_${session.user.id.slice(-6)}`;

  try {
    if (client.statusPageView) {
      statusPageViews = await client.statusPageView.count({
        where: { statusPageId: pageId },
      });
    }

    if (client.referralCode) {
      const refRecord = await client.referralCode.findUnique({
        where: { userId: session.user.id },
        include: {
          referrals: true,
        },
      });

      if (refRecord) {
        code = refRecord.code;
        referralClicks = refRecord.clicks || 0;
        totalSignups = refRecord.referrals?.length || 0;
      }
    }
  } catch (err) {
    console.error("Error fetching status page loop metrics:", err);
  }

  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const referralUrl = `${protocol}://${host}/r/${code}?utm_source=status_page&utm_medium=badge&utm_campaign=status_page_loop&utm_content=${slug}`;

  const baseVisitors =
    statusPageViews > 0 ? statusPageViews : referralClicks > 0 ? referralClicks : 1;
  const conversionRate =
    baseVisitors > 0 ? Number(((totalSignups / baseVisitors) * 100).toFixed(2)) : 0;

  return {
    statusPageViews,
    referralClicks,
    totalSignups,
    conversionRate,
    referralCode: code,
    referralUrl,
  };
}
