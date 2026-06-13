-- AlterTable
ALTER TABLE "EventProposal" ADD COLUMN     "adminNote" TEXT;

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "adminNote" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "submissionId" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

