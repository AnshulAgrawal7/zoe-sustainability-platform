-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_ideaId_fkey";

-- AlterTable: Comment now supports event discourse; ideaId becomes optional.
ALTER TABLE "Comment" ADD COLUMN     "eventId" TEXT,
ALTER COLUMN "ideaId" DROP NOT NULL;

-- AlterTable: optional map coordinates for events (geocoded from `location`).
ALTER TABLE "Event" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- AlterTable: public pseudonymous username. Added nullable, backfilled with a
-- unique handle (sanitized email local-part + a short id suffix to guarantee
-- uniqueness), then made NOT NULL. Existing rows keep working.
ALTER TABLE "User" ADD COLUMN     "username" TEXT;

UPDATE "User"
SET "username" =
  NULLIF(lower(regexp_replace(split_part("email", '@', 1), '[^a-zA-Z0-9_]', '', 'g')), '')
  || '_' || substr("id", 1, 6)
WHERE "username" IS NULL;

-- Fallback for rows whose email local-part sanitized to empty.
UPDATE "User"
SET "username" = 'user_' || substr("id", 1, 8)
WHERE "username" IS NULL;

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "EventProposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'EN',
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "capacity" INTEGER,
    "rewardPoints" INTEGER,
    "imageUrl" TEXT,
    "projectId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "userId" TEXT,
    "createdEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MENTION',
    "actorId" TEXT,
    "commentId" TEXT,
    "eventId" TEXT,
    "ideaId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventProposal_status_idx" ON "EventProposal"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Comment_eventId_idx" ON "Comment"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "EventProposal" ADD CONSTRAINT "EventProposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
