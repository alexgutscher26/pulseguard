import { createAuthClient } from "better-auth/react";

// Hardcoding temporarily to debug SSL error
const baseURL = "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
});
