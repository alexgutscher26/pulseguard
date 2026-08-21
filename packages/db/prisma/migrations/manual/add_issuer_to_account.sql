-- Migration: add issuer column to account table
-- Generated for SteadyStack / PulseGuard database

ALTER TABLE "account"
  ADD COLUMN IF NOT EXISTS "issuer" TEXT;

COMMENT ON COLUMN "account"."issuer"
  IS 'Issuer identifier for OAuth / OIDC accounts';
