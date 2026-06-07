-- Add self-selected audience profile to User (RESIDENT | VISITOR | STUDENT | VOLUNTEER).
ALTER TABLE "User" ADD COLUMN "profile" TEXT NOT NULL DEFAULT 'RESIDENT';
