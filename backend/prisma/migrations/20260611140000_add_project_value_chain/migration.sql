-- Block 5: project value chain (Input -> Activity -> Output), trilingual, optional.
-- Additive only — no data loss.
ALTER TABLE "Project" ADD COLUMN "inputResourcesEn" TEXT;
ALTER TABLE "Project" ADD COLUMN "inputResourcesEl" TEXT;
ALTER TABLE "Project" ADD COLUMN "inputResourcesDe" TEXT;
ALTER TABLE "Project" ADD COLUMN "keyActivitiesEn" TEXT;
ALTER TABLE "Project" ADD COLUMN "keyActivitiesEl" TEXT;
ALTER TABLE "Project" ADD COLUMN "keyActivitiesDe" TEXT;
ALTER TABLE "Project" ADD COLUMN "outputResultsEn" TEXT;
ALTER TABLE "Project" ADD COLUMN "outputResultsEl" TEXT;
ALTER TABLE "Project" ADD COLUMN "outputResultsDe" TEXT;
