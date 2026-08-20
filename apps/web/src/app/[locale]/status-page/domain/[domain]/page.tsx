import type { Metadata } from "next";
import prisma from "@steadystack/db";
import { notFound } from "next/navigation";
import { PublicView } from "@/components/status-pages/public-view";
import { headers, cookies } from "next/headers";
import { PasswordProtection } from "@/components/status-pages/password-protection";
import { getI18nOverrides } from "@/actions/i18n";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import set from "lodash.set";
import { env } from "@steadystack/env/server";
import { verifyAuthToken } from "@steadystack/core";

import { auth } from "@steadystack/auth";
import { canManageStatusPage } from "@/actions/status-pages";

export const dynamic = "force-dynamic";

async function getPageByDomain(domain: string) {
  return prisma.statusPage.findUnique({
    where: { customDomain: domain },
    include: {
      user: {
        select: {
          tier: true,
          referralCode: { select: { code: true } },
        },
      },
      monitors: {
        include: {
          monitor: {
            include: {
              events: { take: 60, orderBy: { timestamp: "desc" } },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

type Props = {
  params: Promise<{ domain: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);
  const page = await getPageByDomain(decodedDomain);

  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.description || undefined,
    icons: page.favicon ? [{ rel: "icon", url: page.favicon }] : undefined,
    openGraph: page.ogImageUrl
      ? {
          images: [{ url: page.ogImageUrl }],
          title: page.metaTitle || page.title,
          description: page.metaDescription || page.description || undefined,
        }
      : undefined,
    robots: {
      index: page.seoIndex ?? true,
      follow: page.seoIndex ?? true,
    },
  };
}

export default async function CustomDomainStatusPage({ params }: Props) {
  const { domain, locale } = await params;
  const decodedDomain = decodeURIComponent(domain);
  const page = await getPageByDomain(decodedDomain);

  if (!page) {
    return notFound();
  }

  const headerStore = await headers();
  const cookieStore = await cookies();

  // 1. IP Whitelist Check
  if (page.ipWhitelist && page.ipWhitelist.trim() !== "") {
    const forwardedFor = headerStore.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "127.0.0.1";

    const allowedIps = page.ipWhitelist.split(",").map((ip) => ip.trim());
    if (!allowedIps.includes(clientIp)) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono p-4 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            403 Forbidden
          </h1>
          <p className="opacity-50 uppercase tracking-widest">
            Access Denied: IP {clientIp} Not authorized
          </p>
        </div>
      );
    }
  }

  // 2. Private Access Check
  if (page.isPrivate) {
    const token = cookieStore.get(`status-page-token-${page.id}`)?.value;
    const isValid = await verifyAuthToken(
      token,
      page.id,
      env.BETTER_AUTH_SECRET,
    );
    if (!isValid) {
      return <PasswordProtection pageId={page.id} title={page.title} />;
    }
  }

  // 3. i18n Logic
  const baseMessages = await getMessages({ locale });
  const overrides = await getI18nOverrides(page.id, locale);

  let messages = baseMessages;
  if (overrides) {
    messages = JSON.parse(JSON.stringify(baseMessages));
    Object.entries(overrides).forEach(([key, value]) => {
      set(messages, key, value);
    });
  }

  const session = await auth.api.getSession({ headers: headerStore });
  const isAdmin = session?.user?.id
    ? await canManageStatusPage(page.id, session.user.id)
    : false;

  // 4. Fetch Active & Recent Incidents (Last 7 Days)
  const monitorIds = page.monitors.map((m) => m.monitorId);
  const incidents = await prisma.incident.findMany({
    where: {
      monitorId: { in: monitorIds },
      OR: [
        { resolvedAt: null },
        { resolvedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      ],
    },
    include: {
      monitor: { select: { name: true } },
      events: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { startedAt: "desc" },
  });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <>
        <label className="sr-only" aria-label="Status Page Label">
          Status Page
        </label>
        <PublicView
          page={page}
          isAdmin={isAdmin}
          initialIncidents={incidents}
        />
      </>
    </NextIntlClientProvider>
  );
}
