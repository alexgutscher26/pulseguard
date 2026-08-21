import { describe, test, expect } from "bun:test";

describe("Better Auth Account Invariants (P0-AUTH-01)", () => {
  test("credential account accountId must equal userId for Better Auth lookup", () => {
    const user = {
      id: "usr_123456",
      email: "admin@steadystack.dev",
    };

    // Correct credential account structure as expected by Better Auth
    const credentialAccount = {
      id: "acc_123456",
      providerId: "credential",
      accountId: user.id, // Must equal user.id, NOT email
      userId: user.id,
    };

    // Better Auth sign-in route check logic simulation:
    // credentialAccount = userRecord.accounts.find(
    //   account => account.providerId === "credential" && account.accountId === userRecord.user.id
    // )
    const matchedAccount = [credentialAccount].find(
      (acc) => acc.providerId === "credential" && acc.accountId === user.id,
    );

    expect(matchedAccount).toBeDefined();
    expect(matchedAccount?.accountId).toBe(user.id);
  });

  test("mismatched accountId (e.g. using email) fails Better Auth credential account resolution", () => {
    const user = {
      id: "usr_123456",
      email: "admin@steadystack.dev",
    };

    // Incorrect seed account structure where accountId was set to email
    const brokenAccount = {
      id: "acc_123456",
      providerId: "credential",
      accountId: user.email, // Mismatched accountId
      userId: user.id,
    };

    const matchedAccount = [brokenAccount].find(
      (acc) => acc.providerId === "credential" && acc.accountId === user.id,
    );

    // This failure is what caused Better Auth to log "User not found" when user was in DB
    expect(matchedAccount).toBeUndefined();
  });
});
