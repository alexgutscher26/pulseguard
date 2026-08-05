"use server";

import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import prisma from "@pulseguard/db";

export interface OnboardingStatus {
  hasCreatedMonitor: boolean;
  hasConfiguredAlert: boolean;
  hasSharedStatusPage: boolean;
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
      monitorsCount: 0,
      channelsCount: 0,
      statusPagesCount: 0,
      completedCount: 0,
      totalCount: 3,
      isComplete: false,
    };
  }

  try {
    const [monitorsCount, channelsCount, statusPagesCount] = await Promise.all([
      prisma.monitor.count({ where: { userId: session.user.id } }),
      prisma.notificationChannel.count({ where: { userId: session.user.id } }),
      prisma.statusPage.count({ where: { userId: session.user.id } }),
    ]);

    const hasCreatedMonitor = monitorsCount > 0;
    const hasConfiguredAlert = channelsCount > 0;
    const hasSharedStatusPage = statusPagesCount > 0;

    let completedCount = 0;
    if (hasCreatedMonitor) completedCount++;
    if (hasConfiguredAlert) completedCount++;
    if (hasSharedStatusPage) completedCount++;

    return {
      hasCreatedMonitor,
      hasConfiguredAlert,
      hasSharedStatusPage,
      monitorsCount,
      channelsCount,
      statusPagesCount,
      completedCount,
      totalCount: 3,
      isComplete: completedCount === 3,
    };
  } catch (error) {
    console.error("Failed to fetch onboarding status:", error);
    return {
      hasCreatedMonitor: false,
      hasConfiguredAlert: false,
      hasSharedStatusPage: false,
      monitorsCount: 0,
      channelsCount: 0,
      statusPagesCount: 0,
      completedCount: 0,
      totalCount: 3,
      isComplete: false,
    };
  }
}
