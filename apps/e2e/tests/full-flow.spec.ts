import { test, expect } from "@playwright/test";
import { db } from "../lib/db";

const TEST_USER = {
  name: "E2E Tester",
  email: `e2e_${Date.now()}@pulseguard.io`,
  password: "Password123!",
};

const MONITOR = {
  name: "E2E Critical Monitor",
  url: "https://example.com",
};

test.describe("E2E Critical Flow", () => {
  // Cleanup user if exists (though we use unique email)
  // We can add afterAll to clean up if we want to keep DB clean.
  test.afterAll(async () => {
    try {
      const user = await db.user.findUnique({ where: { email: TEST_USER.email } });
      if (user) {
        await db.user.delete({ where: { id: user.id } });
      }
    } catch (e) {
      console.log("Cleanup failed (non-critical):", e);
    }
  });

  test("Complete Lifecycle: SignUp -> Create -> Verify -> Delete", async ({ page }) => {
    await test.step("Sign Up", async () => {
      await page.goto("/signup");
      await expect(page).toHaveTitle(/Registration|Sign Up/i);

      await page.getByLabel("Operator Identity").fill(TEST_USER.name);
      await page.getByLabel("Email Command").fill(TEST_USER.email);
      await page.getByLabel("Access Key").fill(TEST_USER.password);

      await page.getByRole("button", { name: /Initiate|Register/i }).click();

      // Expect redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.getByText("Monitor Status")).toBeVisible(); // Dashboard header?
    });

    await test.step("Create Monitor", async () => {
      // Find "Create" or "New" button in header or command palette
      // Assuming there's a visible "New Monitor" or "+" button or link
      // Based on grep, it's in header.tsx. Let's try finding link to /new
      const createLink = page.getByRole("link", { name: /New Monitor|Create/i });

      // Fallback: direct navigation if UI button is hidden behind menu
      if ((await createLink.count()) > 0 && (await createLink.isVisible())) {
        await createLink.click();
      } else {
        await page.goto("/dashboard/monitors/new");
      }

      await expect(page).toHaveURL(/\/monitors\/new/);

      // Fill Monitor Form
      // We assume standard labels "Name" and "URL" or "Target"
      await page.getByLabel("Name", { exact: false }).fill(MONITOR.name);
      await page.getByLabel("URL", { exact: false }).fill(MONITOR.url);

      // Select Type if needed (default usually HTTP)

      await page.getByRole("button", { name: /create|monitor/i }).click();

      // Wait for success and redirect
      await expect(page).toHaveURL(/\/dashboard\/monitors(\/|$)/);
    });

    await test.step("Verify Listing", async () => {
      await page.goto("/dashboard/monitors"); // Ensure we are on list
      await expect(page.getByText(MONITOR.name)).toBeVisible();
      // Optionally check status badge
    });

    await test.step("Delete Monitor", async () => {
      // Navigate to monitor details
      await page.getByText(MONITOR.name).click();

      // Look for "Settings" or "Delete"
      // Assuming a "Settings" tab or button exists in the details layout
      const settingsLink = page.getByRole("link", { name: /settings/i });
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
      } else if (page.url().includes("/settings")) {
        // already there
      } else {
        // Try navigating directly if we can assume ID in URL
        // Or look for delete button directly
      }

      // If we are in settings, look for Delete button
      // It might be "Delete Monitor" in a danger zone
      const deleteButton = page.getByRole("button", { name: /delete monitor/i });
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      // Confirm modal
      const confirmButton = page.getByRole("button", { name: /confirm|delete|continuing/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }

      // Expect redirect back to list
      await expect(page).toHaveURL(/\/dashboard\/monitors/);
      await expect(page.getByText(MONITOR.name)).not.toBeVisible();
    });
  });
});
