-- Event lifecycle: registrations no longer award points immediately. An admin
-- marks an event COMPLETED, and only then do registered logged-in users receive
-- the event's rewardPoints (see eventController.completeEvent).
ALTER TABLE "Event" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'UPCOMING';

-- Citizen reports (environmental issues) & feedback from /participate. Mirrors
-- Idea: open without an account; a valid token links userId. Read-only admin
-- overview for now (no review workflow yet — Future Work).
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Submission_type_idx" ON "Submission"("type");

ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drift fix: the NewsletterSignup model (commit e491e0c, F1-F4) was added to the
-- schema without a migration, so production never got the table. Idempotent so
-- environments that DO have it (e.g. via db push) are unaffected.
CREATE TABLE IF NOT EXISTS "NewsletterSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSignup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSignup_email_key" ON "NewsletterSignup"("email");

-- Drift fix: align the ProjectMetric FK's referential action with the schema
-- (required relation → ON DELETE RESTRICT), so future diffs stay clean.
ALTER TABLE "ProjectMetric" DROP CONSTRAINT "ProjectMetric_projectId_fkey";
ALTER TABLE "ProjectMetric" ADD CONSTRAINT "ProjectMetric_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
