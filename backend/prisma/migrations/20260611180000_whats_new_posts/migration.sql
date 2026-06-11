-- "What's New" feed: imported Facebook posts (FeedPost + translations + images).

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('ANNOUNCEMENT', 'EVENT', 'PROJECT', 'NEWS');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'COMPLETED');

-- CreateTable
CREATE TABLE "FeedPost" (
    "id" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL,
    "eventStatus" "EventStatus",
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "sourceFolder" TEXT NOT NULL,
    "needsReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedPostTranslation" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isMachineTranslated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FeedPostTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedPostImage" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,

    CONSTRAINT "FeedPostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedPost_sourceFolder_key" ON "FeedPost"("sourceFolder");

-- CreateIndex
CREATE UNIQUE INDEX "FeedPostTranslation_postId_locale_key" ON "FeedPostTranslation"("postId", "locale");

-- CreateIndex
CREATE INDEX "FeedPostImage_postId_idx" ON "FeedPostImage"("postId");

-- AddForeignKey
ALTER TABLE "FeedPostTranslation" ADD CONSTRAINT "FeedPostTranslation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "FeedPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedPostImage" ADD CONSTRAINT "FeedPostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "FeedPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
