import { expo } from "@better-auth/expo";
import { getPrisma } from "@pulseguard/db";
import { env } from "@pulseguard/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

console.log("🔧 Initializing BetterAuth with config:", {
  hasSecret: !!env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  corsOrigin: env.CORS_ORIGIN,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
});

// Use getPrisma() to get a real Prisma instance instead of the proxy
const prisma = getPrisma();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    useSecureCookies: env.BETTER_AUTH_URL.startsWith("https"),
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      timezone: {
        type: "string",
        required: false,
        defaultValue: "UTC",
      },
      dateFormat: {
        type: "string",
        required: false,
        defaultValue: "MM/DD/YYYY",
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day - refresh session expiration when used
    freshAge: 60 * 60 * 24, // 1 day - session is considered fresh for 1 day
  },

  trustedOrigins: [
    env.CORS_ORIGIN,
    process.env.NEXT_PUBLIC_APP_URL ?? "",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "mybettertapp://",
    "exp://",
  ],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies(), expo()],
});

console.log("✅ BetterAuth initialized successfully");
