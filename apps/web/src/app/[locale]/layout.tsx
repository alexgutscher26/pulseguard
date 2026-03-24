import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Note: We don't need a html/body here because the root layout likely has it.
  // However, check if root layout supports lang attribute change.
  // Ideally, [locale] should be at the root if we want to change <html lang="...">.
  // But since we are nested inside the root layout (probably), we might need to handle this.
  // For now, let's just provide the context.

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
