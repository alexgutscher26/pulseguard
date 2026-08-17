import { describe, test, expect } from "bun:test";
import { hashPassword, verifyPassword, signAuthToken, verifyAuthToken } from "@pulseguard/core";

describe("Status Page Security & Cryptographic Gate Tests (P0-SEC-01)", () => {
  const secretKey = "pulseguard-test-secret-key-32chars-minimum-safe-entropy";
  const pageId = "page_cm7890123456789";

  test("status page password is hashed and verified securely", async () => {
    const rawPassword = "CustomerSecretPassword#2026";
    const hashedPassword = await hashPassword(rawPassword);

    expect(hashedPassword).not.toBe(rawPassword);
    expect(hashedPassword.startsWith("pbkdf2:v1:")).toBe(true);

    const isAuthorized = await verifyPassword(rawPassword, hashedPassword);
    expect(isAuthorized).toBe(true);

    const isWrong = await verifyPassword("IncorrectPassword", hashedPassword);
    expect(isWrong).toBe(false);
  });

  test("status page authentication issues signed HMAC token", async () => {
    const token = await signAuthToken(pageId, secretKey, 86400);

    expect(token.startsWith("pg_sig:v1:")).toBe(true);
    const isValid = await verifyAuthToken(token, pageId, secretKey);
    expect(isValid).toBe(true);
  });

  test("static string 'authenticated' is rejected as invalid token", async () => {
    const isBypassed = await verifyAuthToken("authenticated", pageId, secretKey);
    expect(isBypassed).toBe(false);
  });

  test("tampered token signatures or expired tokens are rejected", async () => {
    const validToken = await signAuthToken(pageId, secretKey, 86400);
    const tamperedToken = validToken.slice(0, -5) + "ZZZZZ";

    expect(await verifyAuthToken(tamperedToken, pageId, secretKey)).toBe(false);

    // Expired token
    const expiredToken = await signAuthToken(pageId, secretKey, -60);
    expect(await verifyAuthToken(expiredToken, pageId, secretKey)).toBe(false);
  });
});
