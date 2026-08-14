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
    default: "PulseGuard — Uptime monitoring that confirms failures from 7 regions before alerting",
    template: "%s | PulseGuard",
  },
  description:
    "Four of seven global regions must agree before PulseGuard pages you. 60-second checks, 50 monitors, multi-region verification — free, and free for commercial use.",
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
    "multi-region monitoring",
    "quorum verification",
  ],
  authors: [{ name: "PulseGuard Team", url: BASE_URL }],
  creator: "PulseGuard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "PulseGuard",
    title: "PulseGuard — Uptime monitoring that confirms failures from 7 regions before alerting",
    description:
      "Four of seven global regions must agree before PulseGuard pages you. 60-second checks, 50 monitors, multi-region verification — free, and free for commercial use.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseGuard — Uptime monitoring that confirms failures from 7 regions before alerting",
    description:
      "Four of seven global regions must agree before PulseGuard pages you. 60-second checks, 50 monitors, multi-region verification — free, and free for commercial use.",
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
        "Cloudflare edge-native monitoring platform with 60-second checks, 7-region verification, and 4-of-7 quorum failure confirmation.",
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
