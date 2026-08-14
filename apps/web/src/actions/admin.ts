"use server";

import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import prisma from "@pulseguard/db";
import { revalidatePath } from "next/cache";

export interface AdminStatusResponse {
  isAdmin: boolean;
  tier: string;
  email: string | null;
  userId: string | null;
}

/**
 * Checks if the current authenticated user has Admin rights
 */
export async function getAdminStatus(): Promise<AdminStatusResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { isAdmin: false, tier: "INITIATE", email: null, userId: null };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, email: true },
    });

    const tier = dbUser?.tier || session.user.tier || "INITIATE";
    const email = dbUser?.email || session.user.email || null;

    // User is admin if tier is ADMIN, or if email matches ADMIN_EMAILS environment variable
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const isEmailAdmin = Boolean(
      email && adminEmails.includes(email.toLowerCase()),
    );
    const isAdmin = tier === "ADMIN" || isEmailAdmin;

    return {
      isAdmin,
      tier,
      email,
      userId: session.user.id,
    };
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return { isAdmin: false, tier: "INITIATE", email: null, userId: null };
  }
}

/**
 * Elevates the authenticated user's tier to "ADMIN" in the database
 */
export async function grantSelfAdminAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Must be logged in to grant admin access",
      };
    }

    const email = session.user.email?.toLowerCase() || "";
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!email || !adminEmails.includes(email)) {
      return {
        success: false,
        error: "Unauthorized: User email is not listed in ADMIN_EMAILS",
      };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        tier: "ADMIN",
      },
    });

    console.log(
      `[Admin] Granted ADMIN role to user ${session.user.email} (${session.user.id})`,
    );
    revalidatePath("/dashboard/design-partners");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to grant admin access:", error);
    return {
      success: false,
      error: error.message || "Failed to grant admin access",
    };
  }
}
