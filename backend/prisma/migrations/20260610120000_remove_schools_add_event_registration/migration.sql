-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "schoolId";

-- DropTable
DROP TABLE "School";

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_userId_eventId_key" ON "EventRegistration"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
