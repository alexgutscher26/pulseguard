import React from "react";
import { render } from "@react-email/render";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import { emailTheme } from "../styles/theme";
import type { MonitorAlertData } from "../index";

export function MonitorAlert({ data }: { data: MonitorAlertData }) {
  const isDown = data.status === "DOWN";
  const statusColor = isDown
    ? emailTheme.colors.destructive
    : emailTheme.colors.primary;
  const statusText = isDown ? "DOWN" : "UP";
  const dashboardUrl = `https://pulseguard.com/monitors/${data.monitorId}`;

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

          {/* Alert Status */}
          <Section style={{ padding: emailTheme.spacing.lg }}>
            <Text
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
                color: statusColor,
                textAlign: "center",
                marginBottom: emailTheme.spacing.md,
              }}
            >
              {isDown ? "🔴" : "✅"} {statusText}
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "18px",
                color: emailTheme.colors.foreground,
                marginBottom: emailTheme.spacing.sm,
              }}
            >
              <strong>Monitor:</strong> {data.monitorName}
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "14px",
                color: emailTheme.colors.muted,
                marginBottom: emailTheme.spacing.md,
                wordBreak: "break-all",
              }}
            >
              {data.url}
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
                fontSize: "14px",
                color: emailTheme.colors.muted,
                marginBottom: emailTheme.spacing.sm,
              }}
            >
              <strong>Time:</strong> {new Date(data.timestamp).toLocaleString()}
            </Text>

            {data.reason && (
              <Text
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: emailTheme.colors.destructive,
                  marginBottom: emailTheme.spacing.sm,
                }}
              >
                <strong>Reason:</strong> {data.reason}
              </Text>
            )}

            {data.downtimeDuration && !isDown && (
              <Text
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: emailTheme.colors.primary,
                  marginBottom: emailTheme.spacing.md,
                }}
              >
                <strong>Downtime:</strong> {data.downtimeDuration}
              </Text>
            )}

            {data.failedRegions && data.failedRegions.length > 0 && (
              <Text
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: emailTheme.colors.destructive,
                  marginBottom: emailTheme.spacing.md,
                }}
              >
                <strong>Failed Regions:</strong> {data.failedRegions.join(", ")}
              </Text>
            )}

            {/* CTA Button */}
            <Link
              href={dashboardUrl}
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
              VIEW DASHBOARD
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
              Sent by PulseGuard Monitoring System
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
              <Link
                href="https://pulseguard.com/settings/notifications"
                style={{ color: emailTheme.colors.muted }}
              >
                Manage Notifications
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderMonitorAlert(
  data: MonitorAlertData,
): Promise<string> {
  return await render(<MonitorAlert data={data} />);
}
