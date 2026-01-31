import React from "react";
import { render } from "@react-email/render";
import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";
import { emailTheme } from "../styles/theme";
import type { WelcomeEmailData } from "../index";

export function Welcome({ data }: { data: WelcomeEmailData }) {
  return (
    <Html>
      <Head>
        <style>{`
          @media (prefers-color-scheme: dark) {
            body { background-color: ${emailTheme.colors.background} !important; }
          }
        `}</style>
      </Head>
      <Body
        style={{
          backgroundColor: emailTheme.colors.background,
          color: emailTheme.colors.foreground,
          fontFamily: emailTheme.fonts.mono,
          padding: emailTheme.spacing.lg,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            border: `2px solid ${emailTheme.colors.border}`,
            backgroundColor: emailTheme.colors.card,
          }}
        >
          {/* Header */}
          <Section
            style={{
              padding: emailTheme.spacing.lg,
              borderBottom: `1px solid ${emailTheme.colors.border}`,
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              PULSEGUARD
            </Text>
          </Section>

          {/* Welcome Content */}
          <Section style={{ padding: emailTheme.spacing.lg }}>
            <Text
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
                marginBottom: emailTheme.spacing.md,
              }}
            >
              Welcome, {data.userName}
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "16px",
                color: emailTheme.colors.foreground,
                lineHeight: "1.6",
                marginBottom: emailTheme.spacing.md,
              }}
            >
              Your monitoring station is now online. PulseGuard will keep watch over your services
              24/7, alerting you the moment something goes wrong.
            </Text>

            <Hr
              style={{
                borderColor: emailTheme.colors.border,
                margin: `${emailTheme.spacing.md} 0`,
              }}
            />

            <Text
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
                marginBottom: emailTheme.spacing.sm,
              }}
            >
              GETTING STARTED
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "14px",
                color: emailTheme.colors.foreground,
                lineHeight: "1.6",
                marginBottom: emailTheme.spacing.sm,
              }}
            >
              <strong style={{ color: emailTheme.colors.primary }}>
                1. CREATE YOUR FIRST MONITOR
              </strong>
              <br />
              Add the URLs you want to track. We support HTTP, TCP, and PING checks.
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "14px",
                color: emailTheme.colors.foreground,
                lineHeight: "1.6",
                marginBottom: emailTheme.spacing.sm,
              }}
            >
              <strong style={{ color: emailTheme.colors.primary }}>2. CONFIGURE ALERTS</strong>
              <br />
              Set up notification channels (Email, Discord, Slack, Webhook) to get instant alerts.
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "14px",
                color: emailTheme.colors.foreground,
                lineHeight: "1.6",
                marginBottom: emailTheme.spacing.md,
              }}
            >
              <strong style={{ color: emailTheme.colors.primary }}>3. MONITOR & RESPOND</strong>
              <br />
              View real-time status, uptime metrics, and incident history from your dashboard.
            </Text>

            {/* CTA Button */}
            <Link
              href={data.dashboardUrl}
              style={{
                display: "inline-block",
                backgroundColor: emailTheme.colors.primary,
                color: emailTheme.colors.primaryForeground,
                padding: `${emailTheme.spacing.md} ${emailTheme.spacing.xl}`,
                textDecoration: "none",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                border: `2px solid ${emailTheme.colors.primary}`,
                marginTop: emailTheme.spacing.md,
              }}
            >
              CREATE FIRST MONITOR
            </Link>
          </Section>

          {/* Footer */}
          <Section
            style={{
              padding: emailTheme.spacing.lg,
              borderTop: `1px solid ${emailTheme.colors.border}`,
              backgroundColor: emailTheme.colors.background,
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                color: emailTheme.colors.muted,
                textAlign: "center",
              }}
            >
              Need help? Check out our{" "}
              <Link href="https://pulseguard.com/docs" style={{ color: emailTheme.colors.primary }}>
                documentation
              </Link>
            </Text>
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                color: emailTheme.colors.muted,
                textAlign: "center",
                marginTop: emailTheme.spacing.sm,
              }}
            >
              Sent by PulseGuard Monitoring System
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderWelcome(data: WelcomeEmailData): Promise<string> {
  return await render(<Welcome data={data} />);
}
