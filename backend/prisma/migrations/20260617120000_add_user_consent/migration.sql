-- Consent record (GDPR proof of consent). Nullable for pre-existing rows.
ALTER TABLE "User" ADD COLUMN "acceptedTermsAt" TIMESTAMP(3);
