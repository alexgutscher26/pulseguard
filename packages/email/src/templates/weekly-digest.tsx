import React from "react";
import { render } from "@react-email/render";
import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";
import { emailTheme } from "../styles/theme";
import type { WeeklyDigestData } from "../index";

export function WeeklyDigest({ data }: { data: WeeklyDigestData }) {
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

          {/* Digest Header */}
          <Section style={{ padding: emailTheme.spacing.lg }}>
            <Text
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
                marginBottom: emailTheme.spacing.sm,
              }}
            >
              📊 Weekly Report
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "16px",
                color: emailTheme.colors.muted,
                marginBottom: emailTheme.spacing.lg,
              }}
            >
              {data.weekRange}
            </Text>

            {/* Stats Grid */}
            <Section
              style={{
                display: "table",
                width: "100%",
                marginBottom: emailTheme.spacing.lg,
              }}
            >
              {/* Uptime Stat */}
              <Section
                style={{
                  display: "table-cell",
                  width: "33.33%",
                  padding: emailTheme.spacing.md,
                  border: `1px solid ${emailTheme.colors.border}`,
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: emailTheme.colors.primary,
                  }}
                >
                  {data.uptimePercentage}%
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: emailTheme.colors.muted,
                    marginTop: emailTheme.spacing.xs,
                  }}
                >
                  UPTIME
                </Text>
              </Section>

              {/* Monitors Stat */}
              <Section
                style={{
                  display: "table-cell",
                  width: "33.33%",
                  padding: emailTheme.spacing.md,
                  border: `1px solid ${emailTheme.colors.border}`,
                  borderLeft: "none",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: emailTheme.colors.foreground,
                  }}
                >
                  {data.totalMonitors}
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: emailTheme.colors.muted,
                    marginTop: emailTheme.spacing.xs,
                  }}
                >
                  MONITORS
                </Text>
              </Section>

              {/* Incidents Stat */}
              <Section
                style={{
                  display: "table-cell",
                  width: "33.33%",
                  padding: emailTheme.spacing.md,
                  border: `1px solid ${emailTheme.colors.border}`,
                  borderLeft: "none",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    fontSize: "32px",
                    fontWeight: "bold",
                    color:
                      data.totalIncidents > 0
                        ? emailTheme.colors.destructive
                        : emailTheme.colors.primary,
                  }}
                >
                  {data.totalIncidents}
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: emailTheme.colors.muted,
                    marginTop: emailTheme.spacing.xs,
                  }}
                >
                  INCIDENTS
                </Text>
              </Section>
            </Section>

            <Hr
              style={{
                borderColor: emailTheme.colors.border,
                margin: `${emailTheme.spacing.md} 0`,
              }}
            />

            {/* Top Performers */}
            {data.topPerformers.length > 0 && (
              <>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: emailTheme.colors.primary,
                    marginBottom: emailTheme.spacing.md,
                  }}
                >
                  TOP PERFORMERS
                </Text>

                {data.topPerformers.map((monitor, index) => (
                  <Section
                    key={index}
                    style={{
                      padding: emailTheme.spacing.sm,
                      border: `1px solid ${emailTheme.colors.border}`,
                      marginBottom: emailTheme.spacing.sm,
                    }}
                  >
                    <Text
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: emailTheme.colors.foreground,
                      }}
                    >
                      <strong>{monitor.name}</strong>
                    </Text>
                    <Text
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: emailTheme.colors.primary,
                        marginTop: emailTheme.spacing.xs,
                      }}
                    >
                      {monitor.uptime}% uptime
                    </Text>
                  </Section>
                ))}
              </>
            )}

            {/* CTA Button */}
            <Link
              href="https://pulseguard.com/dashboard"
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
                marginTop: emailTheme.spacing.lg,
              }}
            >
              VIEW FULL REPORT
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
              <Link
                href="https://pulseguard.com/settings/notifications"
                style={{ color: emailTheme.colors.muted }}
              >
                Manage Email Preferences
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

export async function renderWeeklyDigest(data: WeeklyDigestData): Promise<string> {
  return await render(<WeeklyDigest data={data} />);
}
