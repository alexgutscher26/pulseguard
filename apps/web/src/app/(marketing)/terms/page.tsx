import type { Metadata } from "next";
import LegalPage from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | PulseGuard",
  description: "PulseGuard Terms of Service — the terms governing your use of our uptime monitoring service.",
  openGraph: {
    title: "Terms of Service | PulseGuard",
    description: "The terms governing your use of PulseGuard.",
  },
};

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using PulseGuard, you agree to be bound by these Terms of Service. If you do not agree, do not use the service. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance.",
  },
  {
    title: "Service Description",
    content:
      "PulseGuard provides uptime monitoring, incident alerting, and status page hosting. Features and availability depend on your subscription plan. We strive for high availability but do not guarantee uninterrupted service. PulseGuard is not a replacement for your own disaster recovery planning.",
  },
  {
    title: "Account Registration",
    content:
      "You must provide accurate, current information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized use at security@pulseguard.app.",
  },
  {
    title: "Acceptable Use",
    content:
      "You agree not to use PulseGuard for any unlawful purpose, to probe or scan systems without authorization, to distribute malware, to send unsolicited communications, or to interfere with the proper functioning of the service. Monitoring targets must be systems you own or have explicit permission to monitor.",
  },
  {
    title: "Payment & Billing",
    content:
      "Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We may change pricing with 30 days notice. Failure to pay may result in suspension or termination of your account.",
  },
  {
    title: "Service Level",
    content:
      "PulseGuard monitors its own infrastructure and publishes live status at status.pulseguard.app. We target 99.9% uptime for the dashboard and API. Monitoring checks sent from our infrastructure depend on third-party networks and are provided on a best-effort basis.",
  },
  {
    title: "Intellectual Property",
    content:
      "PulseGuard, the PulseGuard logo, and the service interface are proprietary. We grant you a limited, non-exclusive, non-transferable license to use the service during your subscription. You retain all rights to the data you submit and the content of your status pages.",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the maximum extent permitted by law, PulseGuard and its contributors are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including lost profits or data loss. Our total liability is limited to the amount you paid us in the 12 months preceding the claim.",
  },
  {
    title: "Termination",
    content:
      "Either party may terminate this agreement at any time. We may suspend or terminate your account for violation of these terms. Upon termination, your right to use the service ceases immediately. Your data will be deleted in accordance with our Privacy Policy.",
  },
  {
    title: "Governing Law",
    content:
      "These terms are governed by the laws of the State of California, without regard to its conflict-of-laws principles. Any disputes shall be resolved exclusively in the federal or state courts of San Francisco County, California.",
  },
  {
    title: "Contact",
    content:
      "For questions about these terms, contact legal@pulseguard.app or write to PulseGuard, 548 Market Street, San Francisco, CA 94104.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      badge="Legally Binding"
      description="These terms govern your access to and use of PulseGuard. Please read them carefully before using the service."
      lastUpdated="July 1, 2026"
      sections={sections}
      otherPage={{
        href: "/privacy",
        label: "Privacy Policy",
        description: "See how we collect, use, and protect your data.",
      }}
    />
  );
}
