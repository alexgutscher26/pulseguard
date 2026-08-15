import * as React from "react";
import { render } from "../primitives";

export interface UsageLimitWarningEmailProps {
  userName: string;
  planName: string;
  warnings: Array<{
    resource: string;
    label: string;
    used: number;
    limit: number;
    percentage: number;
  }>;
  upgradeUrl: string;
}

export const UsageLimitWarningEmail: React.FC<Readonly<UsageLimitWarningEmailProps>> = ({
  userName = "PulseGuard Operator",
  planName = "The Initiate",
  warnings = [
    {
      resource: "monitors",
      label: "Active Monitors",
      used: 42,
      limit: 50,
      percentage: 84,
    },
  ],
  upgradeUrl = "https://pulseguard.io/dashboard/settings?tab=billing",
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
        border: "1px solid #1f2937",
        padding: "32px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div style={{ marginBottom: "24px", textAlign: "left" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            color: "#06b6d4",
            textTransform: "uppercase",
          }}
        >
          PulseGuard Alert
        </span>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#ffffff",
            marginTop: "4px",
          }}
        >
          Workspace Approaching Plan Limits
        </h2>
      </div>

      <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.6" }}>
        Hello {userName}, your workspace on <strong>{planName}</strong> plan is approaching resource
        limits.
      </p>

      <div style={{ marginTop: "24px", marginBottom: "24px" }}>
        {warnings.map((w, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#111827",
              borderRadius: "12px",
              border: "1px solid #1f2937",
              padding: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#f3f4f6",
                }}
              >
                {w.label}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#f59e0b",
                }}
              >
                {w.used} / {w.limit} ({w.percentage}%)
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#1f2937",
                borderRadius: "9999px",
                height: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: w.percentage >= 90 ? "#ef4444" : "#f59e0b",
                  width: `${Math.min(w.percentage, 100)}%`,
                  height: "100%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.6" }}>
        To prevent monitor or integration creation blocks when reaching 100% capacity, upgrade your
        plan.
      </p>

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <a
          href={upgradeUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#0891b2",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "14px",
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Upgrade Workspace Plan
        </a>
      </div>
    </div>
  </div>
);

export async function renderUsageLimitWarning(props: UsageLimitWarningEmailProps): Promise<string> {
  return await render(<UsageLimitWarningEmail {...props} />);
}
