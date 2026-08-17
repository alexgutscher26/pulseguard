import { expo } from "@better-auth/expo";
import { getPrisma } from "@pulseguard/db";
import { env } from "@pulseguard/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { sendPasswordResetEmail, sendTeamInvitationEmail } from "@pulseguard/email";
import { organization } from "better-auth/plugins";

console.log("🔧 Initializing BetterAuth with config:", {
  hasSecret: !!env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  corsOrigin: env.CORS_ORIGIN,
  appUrl: env.NEXT_PUBLIC_APP_URL,
});

const safeDbUrl = env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const safeAuthUrl = env.BETTER_AUTH_URL || "http://localhost:3000";

const prisma = getPrisma(safeDbUrl);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET || "dummy-secret-for-build-123456789",
  baseURL: safeAuthUrl,
  advanced: {
    useSecureCookies: safeAuthUrl.startsWith("https"),
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
      timeFormat: {
        type: "string",
        required: false,
        defaultValue: "HH:mm",
      },
      tier: {
        type: "string",
        required: false,
        defaultValue: "INITIATE",
      },
    },
    deleteUser: {
      enabled: true,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day - refresh session expiration when used
    freshAge: 60 * 60 * 24, // 1 day - session is considered fresh for 1 day
  },

  trustedOrigins: [
    ...(env.CORS_ORIGIN ? [env.CORS_ORIGIN] : []),
    ...(env.NEXT_PUBLIC_APP_URL ? [env.NEXT_PUBLIC_APP_URL] : []),
    ...(env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "exp://", "http://127.0.0.1:3000"]
      : []),
  ],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, _request) => {
      await sendPasswordResetEmail(user.email, {
        userName: user.name || user.email,
        resetUrl: url,
      });
    },
  },
  plugins: [
    nextCookies(),
    expo(),
    organization({
      async sendInvitationEmail(data) {
        const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        await sendTeamInvitationEmail(data.email, {
          organizationName: data.organization.name,
          inviterName:
            data.inviter?.user?.name || data.inviter?.user?.email || "A team administrator",
          role: data.role || "member",
          inviteUrl: `${appUrl}/invitations/${data.id}`,
        });
      },
    }),
  ],
});

console.log("✅ BetterAuth initialized successfully");
