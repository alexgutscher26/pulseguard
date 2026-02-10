import React from "react";
import { render } from "@react-email/render";
import { Html, Head, Body, Container, Section, Text, Link } from "@react-email/components";
import { emailTheme } from "../styles/theme";

export interface SubscriptionConfirmData {
  pageTitle: string;
  verifyUrl: string;
}

export function SubscriptionConfirm({ data }: { data: SubscriptionConfirmData }) {
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
            border: `2px solid ${emailTheme.colors.primary}`,
            backgroundColor: emailTheme.colors.card,
            boxShadow: `0 0 20px -5px ${emailTheme.colors.primary}40`,
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
                fontSize: "24px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              CONFIRM SUBSCRIPTION
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: emailTheme.spacing.lg, textAlign: "center" }}>
            <Text
              style={{
                margin: "0 0 24px",
                fontSize: "16px",
                lineHeight: "24px",
                color: emailTheme.colors.foreground,
              }}
            >
              You've requested to subscribe to status updates for:
            </Text>

            <Text
              style={{
                margin: "0 0 32px",
                fontSize: "20px",
                fontWeight: "bold",
                color: emailTheme.colors.primary,
              }}
            >
              {data.pageTitle}
            </Text>

            <Text
              style={{
                margin: "0 0 32px",
                fontSize: "14px",
                color: emailTheme.colors.muted,
              }}
            >
              Please confirm your email address to start receiving notifications about incidents and
              maintenance.
            </Text>

            {/* CTA Button */}
            <Link
              href={data.verifyUrl}
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
              }}
            >
              CONFIRM EMAIL
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
              If you didn't request this subscription, you can safely ignore this email.
            </Text>
            <Text
              style={{
                margin: "12px 0 0",
                fontSize: "12px",
                color: emailTheme.colors.muted,
                textAlign: "center",
              }}
            >
              Powered by PulseGuard
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderSubscriptionConfirm(data: SubscriptionConfirmData): Promise<string> {
  return await render(<SubscriptionConfirm data={data} />);
}
