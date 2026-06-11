-- Trilingual alt texts for feed images. Replaces the single FeedPostImage.altText
-- (which was null for every row → no data loss) with a per-locale table.

-- CreateTable
CREATE TABLE "FeedPostImageAltText" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "needsReview" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FeedPostImageAltText_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedPostImageAltText_imageId_locale_key" ON "FeedPostImageAltText"("imageId", "locale");

-- AddForeignKey
ALTER TABLE "FeedPostImageAltText" ADD CONSTRAINT "FeedPostImageAltText_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "FeedPostImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropColumn (single-language altText, superseded by the table above)
ALTER TABLE "FeedPostImage" DROP COLUMN "altText";
