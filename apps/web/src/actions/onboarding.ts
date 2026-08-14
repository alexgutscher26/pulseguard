"use server";

import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import prisma from "@pulseguard/db";

export interface OnboardingStatus {
  hasCreatedMonitor: boolean;
  hasConfiguredAlert: boolean;
  hasSharedStatusPage: boolean;
  onboardingCompleted: boolean;
  monitorsCount: number;
  channelsCount: number;
  statusPagesCount: number;
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      hasCreatedMonitor: false,
      hasConfiguredAlert: false,
      hasSharedStatusPage: false,
      onboardingCompleted: false,
      monitorsCount: 0,
      channelsCount: 0,
      statusPagesCount: 0,
      completedCount: 0,
      totalCount: 3,
      isComplete: false,
    };
  }

  try {
    const [user, monitorsCount, channelsCount, statusPagesCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { onboardingCompleted: true },
      }),
      prisma.monitor.count({ where: { userId: session.user.id } }),
      prisma.notificationChannel.count({
        where: { userId: session.user.id },
      }),
      prisma.statusPage.count({ where: { userId: session.user.id } }),
    ]);

    const hasCreatedMonitor = monitorsCount > 0;
    const hasConfiguredAlert = channelsCount > 0;
    const hasSharedStatusPage = statusPagesCount > 0;

    let completedCount = 0;
    if (hasCreatedMonitor) completedCount++;
    if (hasConfiguredAlert) completedCount++;
    if (hasSharedStatusPage) completedCount++;

    const dbCompleted = Boolean(user?.onboardingCompleted);
    const isComplete = dbCompleted || completedCount === 3;

    return {
      hasCreatedMonitor,
      hasConfiguredAlert,
      hasSharedStatusPage,
      onboardingCompleted: dbCompleted,
      monitorsCount,
      channelsCount,
      statusPagesCount,
      completedCount: isComplete ? 3 : completedCount,
      totalCount: 3,
      isComplete,
    };
  } catch (error) {
    console.error("Failed to fetch onboarding status:", error);
    return {
      hasCreatedMonitor: false,
      hasConfiguredAlert: false,
      hasSharedStatusPage: false,
      onboardingCompleted: false,
      monitorsCount: 0,
      channelsCount: 0,
      statusPagesCount: 0,
      completedCount: 0,
      totalCount: 3,
      isComplete: false,
    };
  }
}

export async function completeOnboarding(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark onboarding as completed in DB:", error);
    return { success: false, error: "Failed to update onboarding status." };
  }
}
