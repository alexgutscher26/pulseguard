"use server";

import { auth } from "@pulseguard/auth";
import db, { resetPrisma } from "@pulseguard/db";
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
  if (!(db as any).referralCode) {
    try {
      await resetPrisma();
    } catch {}
  }
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
