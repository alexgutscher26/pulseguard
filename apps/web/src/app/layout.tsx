import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pulseguard.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PulseGuard | Website Monitoring & Real-time Uptime Platform",
    template: "%s | PulseGuard",
  },
  description:
    "24/7 web monitoring, multi-region checks, and instant notifications. Monitor website latency, SSL certificates, cron jobs, and DNS performance in minutes.",
  applicationName: "PulseGuard",
  alternates: {
    canonical: "./",
  },
  keywords: [
    "website monitoring",
    "uptime tracker",
    "latency checker",
    "SSL monitor",
    "cron check",
    "dns monitor",
    "status page",
    "SaaS dashboard",
  ],
  authors: [{ name: "PulseGuard Team", url: BASE_URL }],
  creator: "PulseGuard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "PulseGuard",
    title: "PulseGuard | Website Monitoring & Real-time Uptime Platform",
    description:
      "24/7 website monitoring, multi-region voting consensus, and instant notifications. Setup latency, SSL, port, and cron checkers in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseGuard | Website Monitoring & Real-time Uptime Platform",
    description:
      "24/7 web monitoring, multi-region checks, and instant notifications. Monitor website latency, SSL certificates, cron jobs, and DNS performance in minutes.",
    creator: "@pulseguard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "PulseGuard",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      sameAs: ["https://github.com/alexgutscher26/pulseguard", "https://twitter.com/pulseguard"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "PulseGuard",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/#software`,
      name: "PulseGuard Telemetry & Monitoring",
      operatingSystem: "All",
      applicationCategory: "DeveloperApplication",
      description:
        "Cloudflare edge-native monitoring platform with sub-minute check intervals, multi-region verification, and zero false positives.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "79",
        offerCount: "3",
      },
    },
  ],
};

/**
 * Renders the root layout of the application with children components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
