import { createAuthClient } from "better-auth/react";

// Hardcoding temporarily to debug SSL error
const baseURL = "http://localhost:3000";
console.log("-----------------------------------------");
console.log("[AuthClient] FORCED baseURL:", baseURL);
console.log("[AuthClient] process.env.NEXT_PUBLIC_APP_URL was:", process.env.NEXT_PUBLIC_APP_URL);
console.log("-----------------------------------------");

export const authClient = createAuthClient({
  baseURL,
});
