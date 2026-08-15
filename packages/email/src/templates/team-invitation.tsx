import React from "react";
import { render, Html, Head, Body, Container, Section, Text, Link, Hr } from "../primitives";
import { emailTheme } from "../styles/theme";

export interface TeamInvitationEmailData {
  inviterName: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
}

export function TeamInvitation({ data }: { data: TeamInvitationEmailData }) {
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

          {/* Invitation Content */}
          <Section style={{ padding: emailTheme.spacing.lg }}>
            <Text
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
                marginBottom: emailTheme.spacing.md,
              }}
            >
              Team Workspace Invitation
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
              <strong>{data.inviterName}</strong> has invited you to join the{" "}
              <strong>{data.organizationName}</strong> team workspace on PulseGuard with the role{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: emailTheme.colors.primary,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  textTransform: "uppercase",
                }}
              >
                {data.role}
              </span>
              .
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "15px",
                color: emailTheme.colors.muted,
                lineHeight: "1.6",
                marginBottom: emailTheme.spacing.lg,
              }}
            >
              As part of this team, you will collaborate on monitoring targets, investigating
              incidents, managing alert escalations, and viewing real-time latency telemetry.
            </Text>

            {/* CTA Button */}
            <Link
              href={data.inviteUrl}
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
                marginTop: emailTheme.spacing.sm,
                marginBottom: emailTheme.spacing.md,
              }}
            >
              ACCEPT INVITATION
            </Link>

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
                lineHeight: "1.6",
              }}
            >
              If you did not expect this invitation, you can ignore this email.
            </Text>

            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                color: emailTheme.colors.muted,
                lineHeight: "1.6",
                marginTop: emailTheme.spacing.sm,
                wordBreak: "break-all",
              }}
            >
              Direct Link: {data.inviteUrl}
            </Text>
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
              This invitation link expires in 7 days
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
              Sent by PulseGuard Monitoring Platform
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderTeamInvitation(data: TeamInvitationEmailData): Promise<string> {
  return await render(<TeamInvitation data={data} />);
}
