import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pulseguard.com"),
  title: {
    default: "PulseGuard | Website Monitoring & Real-time Uptime Platform",
    template: "%s | PulseGuard",
  },
  description:
    "24/7 web monitoring, multi-region checks, and instant notifications. Monitor website latency, SSL certificates, cron jobs, and DNS performance in minutes.",
  applicationName: "PulseGuard",
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
  authors: [{ name: "PulseGuard Team", url: "https://pulseguard.com" }],
  creator: "PulseGuard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pulseguard.com",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
