import React from "react";
import { render } from "@react-email/render";
import { Html, Head, Body, Container, Section, Text, Link, Hr } from "@react-email/components";
import { emailTheme } from "../styles/theme";
import type { VerificationEmailData } from "../index";

export function Verification({ data }: { data: VerificationEmailData }) {
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

          {/* Verification Content */}
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
              Verify Your Email
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
              Hi {data.userName},
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
              Click the button below to verify your email address and activate your PulseGuard
              account.
            </Text>

            {/* CTA Button */}
            <Link
              href={data.verificationUrl}
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
              VERIFY EMAIL
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
              If you didn't create a PulseGuard account, you can safely ignore this email.
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
              Or copy and paste this link: {data.verificationUrl}
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
              This verification link expires in 24 hours
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

export async function renderVerification(data: VerificationEmailData): Promise<string> {
  return await render(<Verification data={data} />);
}
