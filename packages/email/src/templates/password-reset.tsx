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

export interface PasswordResetEmailData {
  userName?: string;
  resetUrl: string;
}

export function PasswordReset({ data }: { data: PasswordResetEmailData }) {
  const displayName = data.userName || "PulseGuard User";

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

          {/* Content */}
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
              Reset Your Password
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
              Hi {displayName},
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
              We received a request to reset your password for your PulseGuard
              account. Click the button below to choose a new password.
            </Text>

            {/* CTA Button */}
            <Link
              href={data.resetUrl}
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
                marginBottom: emailTheme.spacing.md,
              }}
            >
              RESET PASSWORD
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
              If you didn't request a password reset, you can safely ignore this
              email. Your password will remain unchanged.
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
              Or copy and paste this link into your browser: {data.resetUrl}
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
              This link is valid for a limited time.
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
              Sent by PulseGuard Security System
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderPasswordReset(
  data: PasswordResetEmailData,
): Promise<string> {
  return await render(<PasswordReset data={data} />);
}
