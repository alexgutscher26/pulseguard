import * as React from "react";
import { render } from "../primitives";

export interface DunningNoticeEmailProps {
  userName: string;
  planName: string;
  amountDue: string;
  failureReason?: string;
  billingPortalUrl: string;
}

export const DunningNoticeEmail: React.FC<Readonly<DunningNoticeEmailProps>> = ({
  userName = "PulseGuard Operator",
  planName = "The Netrunner",
  amountDue = "$19.00",
  failureReason = "Card declined",
  billingPortalUrl = "https://pulseguard.io/dashboard/settings?tab=billing",
}) => (
  <div
    style={{
      backgroundColor: "#030712",
      color: "#f3f4f6",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "40px 20px",
    }}
  >
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        backgroundColor: "#0b0f19",
        borderRadius: "16px",
        border: "1px solid #ef444433",
        padding: "32px",
        boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.1)",
      }}
    >
      <div style={{ marginBottom: "24px", textAlign: "left" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            color: "#ef4444",
            textTransform: "uppercase",
          }}
        >
          Billing Action Required
        </span>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#ffffff",
            marginTop: "4px",
          }}
        >
          Payment Failed for Your PulseGuard Subscription
        </h2>
      </div>

      <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.6" }}>
        Hello {userName}, we were unable to process the automatic payment for your{" "}
        <strong>{planName}</strong> plan subscription.
      </p>

      <div
        style={{
          backgroundColor: "#1f1215",
          borderRadius: "12px",
          border: "1px solid #ef444440",
          padding: "20px",
          marginTop: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>Invoice Amount Due:</span>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#f87171" }}>{amountDue}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>Reason for Failure:</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#fca5a5" }}>
            {failureReason}
          </span>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.6" }}>
        Don't worry! Your monitoring endpoints remain active during our grace period retry schedule.
        Please update your payment method to ensure uninterrupted telemetry checks and alerts.
      </p>

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <a
          href={billingPortalUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "14px",
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Update Payment Method
        </a>
      </div>
    </div>
  </div>
);

export async function renderDunningNotice(props: DunningNoticeEmailProps): Promise<string> {
  return await render(<DunningNoticeEmail {...props} />);
}
