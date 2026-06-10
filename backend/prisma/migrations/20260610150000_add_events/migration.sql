-- Additive migration: new Event table + nullable FK to Project. No existing table
-- is altered; EventRegistration.eventId stays a soft reference (validated at the
-- application layer), so historical registrations are preserved without loss.

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEl" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionEl" TEXT NOT NULL,
    "descriptionDe" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "category" TEXT NOT NULL,
    "rewardPoints" INTEGER NOT NULL DEFAULT 20,
    "capacity" INTEGER,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_projectId_idx" ON "Event"("projectId");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
