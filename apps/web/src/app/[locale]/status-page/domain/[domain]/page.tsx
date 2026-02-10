import prisma from "@pulseguard/db";
import { notFound } from "next/navigation";
import { PublicView } from "@/components/status-pages/public-view";
import { headers, cookies } from "next/headers";
import { PasswordProtection } from "@/components/status-pages/password-protection";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getI18nOverrides } from "@/actions/i18n";
import set from "lodash.set";

async function getPageByDomain(domain: string) {
  return prisma.statusPage.findUnique({
    where: { customDomain: domain },
    include: {
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
    title: page.title,
    description: page.description,
    icons: page.favicon ? [{ rel: "icon", url: page.favicon }] : undefined,
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
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const allowedIps = page.ipWhitelist.split(",").map((ip) => ip.trim());
    if (!allowedIps.includes(clientIp)) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono p-4 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
          <p className="opacity-50 uppercase tracking-widest">
            Access Denied: IP {clientIp} Not authorized
          </p>
        </div>
      );
    }
  }

  // 2. Private Access Check
  if (page.isPrivate) {
    const token = cookieStore.get(`status-page-token-${page.id}`);
    if (token?.value !== "authenticated") {
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

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <PublicView page={page} />
    </NextIntlClientProvider>
  );
}
