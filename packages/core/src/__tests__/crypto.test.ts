import { describe, test, expect } from "bun:test";
import { encryptSecret, decryptSecret, isEncrypted } from "../index";

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
