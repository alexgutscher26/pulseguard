"use server";

import prisma from "@pulseguard/db";
import { revalidatePath } from "next/cache";

export type I18nSettings = {
  locale: string;
  enabled: boolean;
  overrides: Record<string, string>;
};

/**
 * Retrieves language settings for a given status page ID.
 */
export async function getLanguageSettings(statusPageId: string): Promise<I18nSettings[]> {
  const settings = await prisma.statusPageI18n.findMany({
    where: { statusPageId },
  });

  // Normalize data
  return settings.map((s) => ({
    locale: s.locale,
    enabled: s.enabled,
    overrides: (s.overrides as Record<string, string>) || {},
  }));
}

export async function updateLanguageSettings(
  statusPageId: string,
  locale: string,
  data: { enabled?: boolean; overrides?: Record<string, string> }
) {
  await prisma.statusPageI18n.upsert({
    where: {
      statusPageId_locale: {
        statusPageId,
        locale,
      },
    },
    update: {
      enabled: data.enabled,
      overrides: data.overrides,
    },
    create: {
      statusPageId,
      locale,
      enabled: data.enabled ?? true,
      overrides: data.overrides ?? {},
    },
  });

  revalidatePath(`/status-page/${statusPageId}`); // Revalidate editor or public page?
  // Ideally, revalidate the public page paths too.
}

// Function to fetch overrides for public page consumption
/**
 * Retrieves internationalization (i18n) overrides for a given status page and locale.
 *
 * This function queries the database for i18n settings associated with the provided
 * statusPageId and locale. If the settings are found and enabled, it returns the
 * corresponding overrides as a Record. If no settings are found or they are not enabled,
 * it returns null.
 *
 * @param {string} statusPageId - The unique identifier for the status page.
 * @param {string} locale - The locale for which to retrieve the i18n overrides.
 */
export async function getI18nOverrides(statusPageId: string, locale: string) {
  const settings = await prisma.statusPageI18n.findUnique({
    where: {
      statusPageId_locale: {
        statusPageId,
        locale,
      },
    },
  });

  if (!settings || !settings.enabled) return null;
  return settings.overrides as Record<string, string>;
}
