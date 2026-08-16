import { describe, test, expect } from "bun:test";
import {
  encryptSecret,
  decryptSecret,
  isEncrypted,
  hashPassword,
  verifyPassword,
  signAuthToken,
  verifyAuthToken,
} from "../index";

describe("Field-Level AES-256-GCM Encryption & Decryption (P0-SEC-02)", () => {
  const testSecretKey = "pulseguard-test-secret-key-32chars-minimum-safe-entropy";

  test("correctly detects whether a string is encrypted with enc:v1: prefix", async () => {
    expect(isEncrypted("enc:v1:YWJjZGVmZ2hpams=")).toBe(true);
    expect(isEncrypted("plain text")).toBe(false);
    expect(isEncrypted('{"Authorization":"Bearer secret123"}')).toBe(false);
    expect(isEncrypted(null)).toBe(false);
    expect(isEncrypted(undefined)).toBe(false);
  });

  test("encrypts and decrypts sensitive plaintext successfully (round-trip)", async () => {
    const rawSecret = JSON.stringify({
      Authorization: "Bearer super-secret-api-token-xyz-12345",
      "X-Api-Key": "key_abcdef1234567890",
    });

    const encrypted = await encryptSecret(rawSecret, testSecretKey);

    expect(encrypted).not.toBe(rawSecret);
    expect(isEncrypted(encrypted)).toBe(true);
    expect(encrypted.startsWith("enc:v1:")).toBe(true);

    const decrypted = await decryptSecret(encrypted, testSecretKey);
    expect(decrypted).toBe(rawSecret);
    expect(JSON.parse(decrypted)).toEqual({
      Authorization: "Bearer super-secret-api-token-xyz-12345",
      "X-Api-Key": "key_abcdef1234567890",
    });
  });

  test("gracefully returns original plaintext if ciphertext is not encrypted (backward compatibility)", async () => {
    const legacyPlaintext = '{"Authorization":"Bearer legacy-plaintext-key"}';
    const result = await decryptSecret(legacyPlaintext, testSecretKey);
    expect(result).toBe(legacyPlaintext);
  });

  test("handles empty string, null, and undefined input safely without throwing", async () => {
    expect(await encryptSecret("", testSecretKey)).toBe("");
    expect(await decryptSecret("", testSecretKey)).toBe("");
    expect(await decryptSecret(null, testSecretKey)).toBe("");
    expect(await decryptSecret(undefined, testSecretKey)).toBe("");
  });

  test("returns original payload without crashing if decryption fails (e.g. corrupted ciphertext)", async () => {
    const corruptedPayload = "enc:v1:corrupted-base64-payload!!!";
    const result = await decryptSecret(corruptedPayload, testSecretKey);
    expect(result).toBe(corruptedPayload);
  });
});

describe("Status Page PBKDF2 Password Hashing (P0-SEC-01)", () => {
  test("hashes plaintext passwords with random salt", async () => {
    const password = "UltraSecurePassword2026!";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1.startsWith("pbkdf2:v1:")).toBe(true);
    expect(hash2.startsWith("pbkdf2:v1:")).toBe(true);
    // Unique salt per hash
    expect(hash1).not.toBe(hash2);
    expect(hash1).not.toBe(password);
  });

  test("verifies valid password against generated hash", async () => {
    const password = "MySecretStatusPassword!";
    const hash = await hashPassword(password);

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword("WrongPassword123!", hash);
    expect(isWrong).toBe(false);
  });

  test("verifies legacy plaintext passwords for backward compatibility", async () => {
    const legacyPlaintext = "LegacyPlainPassword123";
    const isMatch = await verifyPassword(legacyPlaintext, legacyPlaintext);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword("DifferentPassword", legacyPlaintext);
    expect(isWrong).toBe(false);
  });

  test("handles empty/null password inputs safely", async () => {
    expect(await hashPassword("")).toBe("");
    expect(await verifyPassword("", "")).toBe(false);
    expect(await verifyPassword("somepass", null)).toBe(false);
    expect(await verifyPassword("somepass", undefined)).toBe(false);
  });
});

describe("Status Page Cryptographic HMAC Token Authentication (P0-SEC-01)", () => {
  const secretKey = "pulseguard-test-secret-key-32chars-minimum-safe-entropy";
  const pageId = "page_cm7183019481948194";

  test("generates and verifies signed HMAC token for status page auth", async () => {
    const token = await signAuthToken(pageId, secretKey, 3600);

    expect(token.startsWith("pg_sig:v1:")).toBe(true);

    const isValid = await verifyAuthToken(token, pageId, secretKey);
    expect(isValid).toBe(true);
  });

  test("rejects forged or tampered token cookies", async () => {
    const validToken = await signAuthToken(pageId, secretKey, 3600);

    // Tampered payload
    const wrongPageToken = validToken.replace(pageId, "different_page_id");
    expect(await verifyAuthToken(wrongPageToken, pageId, secretKey)).toBe(false);

    // Tampered signature
    const tamperedSigToken = validToken.slice(0, -4) + "AAAA";
    expect(await verifyAuthToken(tamperedSigToken, pageId, secretKey)).toBe(false);

    // Static unauthenticated bypass string
    expect(await verifyAuthToken("authenticated", pageId, secretKey)).toBe(false);
    expect(await verifyAuthToken(null, pageId, secretKey)).toBe(false);
    expect(await verifyAuthToken(undefined, pageId, secretKey)).toBe(false);
  });

  test("rejects expired tokens", async () => {
    // Generate token with negative TTL (already expired)
    const expiredToken = await signAuthToken(pageId, secretKey, -10);
    const isValid = await verifyAuthToken(expiredToken, pageId, secretKey);
    expect(isValid).toBe(false);
  });
});
