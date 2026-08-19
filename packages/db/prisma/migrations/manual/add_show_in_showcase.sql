-- Migration: add showInShowcase to StatusPage
-- Generated for SteadyStack production database

ALTER TABLE "StatusPage"
  ADD COLUMN IF NOT EXISTS "showInShowcase" BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN "StatusPage"."showInShowcase"
  IS 'When true, this public status page appears in the community showcase gallery';
