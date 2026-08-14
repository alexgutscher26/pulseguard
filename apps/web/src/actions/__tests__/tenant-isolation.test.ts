import { describe, test, expect } from "bun:test";
import {
  addMonitorToPage,
  deleteStatusPageOverride,
  createStatusPageOverride,
  getStatusPage,
} from "../status-pages";
import { getVerifiedSubscribers } from "../subscriptions";
import { getMonitor, toggleMonitor, deleteMonitor } from "../monitors";
import { getIncident, updateIncidentStatus } from "../incidents";
import {
  deleteAlertRule,
  deleteNotificationChannel,
  sendTestNotification,
} from "../notifications";
import {
  createMaintenanceWindow,
  deleteMaintenanceWindow,
} from "../maintenance";
import { disconnectIntegration } from "../integrations";

describe("Comprehensive Multi-Tenant Isolation Tests", () => {
  describe("Status Pages Domain", () => {
    test("addMonitorToPage rejects cross-tenant monitor linkage", async () => {
      const res = await addMonitorToPage("user-b-page-id", "user-a-monitor-id");
      expect(res.success).toBe(false);
    });

    test("deleteStatusPageOverride rejects cross-tenant override deletion", async () => {
      const res = await deleteStatusPageOverride(
        "user-b-page-id",
        "user-a-override-id",
      );
      expect(res.success).toBe(false);
    });

    test("createStatusPageOverride rejects cross-tenant monitor override", async () => {
      const res = await createStatusPageOverride(
        "user-b-page-id",
        "user-a-monitor-id",
        "2026-08-06",
        "DOWN",
      );
      expect(res.success).toBe(false);
    });

    test("getStatusPage returns null for unauthenticated / cross-tenant access", async () => {
      const res = await getStatusPage("user-a-status-page-id");
      expect(res).toBeNull();
    });
  });

  describe("Subscriptions & Notifications Domain", () => {
    test("getVerifiedSubscribers enforces tenant ownership on statusPageId", async () => {
      const subscribers = await getVerifiedSubscribers("user-a-status-page-id");
      expect(subscribers).toEqual([]);
    });

    test("deleteAlertRule prevents cross-tenant rule deletion", async () => {
      const res = await deleteAlertRule("user-a-rule-id");
      expect(res.success).toBe(false);
    });

    test("deleteNotificationChannel prevents cross-tenant channel deletion", async () => {
      const res = await deleteNotificationChannel("user-a-channel-id");
      expect(res.success).toBe(false);
    });

    test("sendTestNotification prevents cross-tenant channel testing", async () => {
      const res = await sendTestNotification("user-a-channel-id");
      expect(res.success).toBe(false);
    });
  });

  describe("Monitors & Incidents Domain", () => {
    test("getMonitor returns null when accessing another tenant's monitor", async () => {
      const res = await getMonitor("user-a-monitor-id");
      expect(res).toBeNull();
    });

    test("toggleMonitor rejects toggling another tenant's monitor", async () => {
      const res = await toggleMonitor("user-a-monitor-id", false);
      expect(res.success).toBe(false);
    });

    test("deleteMonitor rejects deleting another tenant's monitor", async () => {
      const res = await deleteMonitor("user-a-monitor-id");
      expect(res.success).toBe(false);
    });

    test("getIncident returns null for cross-tenant access", async () => {
      const res = await getIncident("user-a-incident-id");
      expect(res).toBeNull();
    });

    test("updateIncidentStatus rejects cross-tenant status updates", async () => {
      const res = await updateIncidentStatus("user-a-incident-id", "RESOLVED");
      expect(res.success).toBe(false);
    });
  });

  describe("Maintenance & Integrations Domain", () => {
    test("deleteMaintenanceWindow rejects unauthorized maintenance window deletion", async () => {
      const res = await deleteMaintenanceWindow("user-a-window-id");
      expect(res.success).toBe(false);
    });

    test("disconnectIntegration rejects unauthorized integration disconnection", async () => {
      const res = await disconnectIntegration("user-a-integration-id");
      expect(res.success).toBe(false);
    });
  });
});
