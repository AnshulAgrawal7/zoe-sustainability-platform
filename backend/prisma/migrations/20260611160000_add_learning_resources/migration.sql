-- Block B: locally-grounded educational content (Z5), additive.

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEl" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyEl" TEXT NOT NULL,
    "bodyDe" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sdgIds" TEXT NOT NULL DEFAULT '[]',
    "imageUrl" TEXT,
    "sourceNote" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningResource_projectId_idx" ON "LearningResource"("projectId");

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
