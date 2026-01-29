import { expo } from "@better-auth/expo";
import prisma from "@pulseguard/db";
import { env } from "@pulseguard/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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

  trustedOrigins: [env.CORS_ORIGIN, process.env.NEXT_PUBLIC_APP_URL ?? "", "mybettertapp://", "exp://"],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies(), expo()],
});
