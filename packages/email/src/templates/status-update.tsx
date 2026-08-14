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

export interface StatusUpdateData {
  pageTitle: string;
  incidentTitle: string;
  incidentStatus:
    | "INVESTIGATING"
    | "IDENTIFIED"
    | "MONITORING"
    | "RESOLVED"
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED";
  description: string;
  affectedMonitors: string[];
  manageUrl: string;
  pageUrl: string;
}

export function StatusUpdate({ data }: { data: StatusUpdateData }) {
  const isResolved =
    data.incidentStatus === "RESOLVED" || data.incidentStatus === "COMPLETED";
  const isMaintenance =
    data.incidentStatus === "SCHEDULED" ||
    data.incidentStatus === "IN_PROGRESS";

  let statusColor: string = emailTheme.colors.destructive;
  let statusIcon = "⚠️";

  if (isResolved) {
    statusColor = emailTheme.colors.primary;
    statusIcon = "✅";
  } else if (isMaintenance) {
    statusColor = "#f59e0b"; // Amber/Orange
    statusIcon = "🔧";
  }

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
            border: `2px solid ${statusColor}`,
            backgroundColor: emailTheme.colors.card,
          }}
        >
          {/* Header */}
          <Section
            style={{
              padding: emailTheme.spacing.lg,
              borderBottom: `1px solid ${emailTheme.colors.border}`,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "14px",
                color: emailTheme.colors.muted,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              {data.pageTitle}
            </Text>
            <Text
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: statusColor,
              }}
            >
              {statusIcon} {data.incidentStatus}
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: emailTheme.spacing.lg }}>
            <Text
              style={{
                margin: "0 0 16px",
                fontSize: "20px",
                fontWeight: "bold",
                color: emailTheme.colors.foreground,
              }}
            >
              {data.incidentTitle}
            </Text>

            <Text
              style={{
                margin: "0 0 24px",
                fontSize: "16px",
                lineHeight: "24px",
                color: emailTheme.colors.foreground,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.description}
            </Text>

            {data.affectedMonitors.length > 0 && (
              <>
                <Hr
                  style={{
                    borderColor: emailTheme.colors.border,
                    margin: "24px 0",
                  }}
                />
                <Text
                  style={{
                    margin: "0 0 12px",
                    fontSize: "12px",
                    color: emailTheme.colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Affected Components
                </Text>
                {data.affectedMonitors.map((monitor, i) => (
                  <Text
                    key={i}
                    style={{
                      margin: "0 0 8px",
                      fontSize: "14px",
                      color: emailTheme.colors.foreground,
                      padding: "8px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                    }}
                  >
                    • {monitor}
                  </Text>
                ))}
              </>
            )}

            <Section style={{ marginTop: "32px", textAlign: "center" }}>
              <Link
                href={data.pageUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: statusColor,
                  color: "#000000",
                  padding: `${emailTheme.spacing.md} ${emailTheme.spacing.xl}`,
                  textDecoration: "none",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderRadius: "4px",
                }}
              >
                View Status Page
              </Link>
            </Section>
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
              Powered by PulseGuard
            </Text>
            <Text
              style={{
                margin: "12px 0 0",
                fontSize: "12px",
                color: emailTheme.colors.muted,
                textAlign: "center",
              }}
            >
              <Link
                href={data.manageUrl}
                style={{
                  color: emailTheme.colors.muted,
                  textDecoration: "underline",
                }}
              >
                Unsubscribe or Manage Preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderStatusUpdate(
  data: StatusUpdateData,
): Promise<string> {
  return await render(<StatusUpdate data={data} />);
}
