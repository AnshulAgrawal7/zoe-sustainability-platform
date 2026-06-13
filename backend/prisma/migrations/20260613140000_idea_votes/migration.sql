-- CreateTable
CREATE TABLE "IdeaVote" (
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaVote_pkey" PRIMARY KEY ("ideaId","userId")
);

-- CreateIndex
CREATE INDEX "IdeaVote_ideaId_idx" ON "IdeaVote"("ideaId");

-- AddForeignKey
ALTER TABLE "IdeaVote" ADD CONSTRAINT "IdeaVote_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaVote" ADD CONSTRAINT "IdeaVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

