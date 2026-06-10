-- Additive: optional map coordinates on Project. No existing column/data altered.

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "lat" DOUBLE PRECISION;
ALTER TABLE "Project" ADD COLUMN     "lng" DOUBLE PRECISION;
