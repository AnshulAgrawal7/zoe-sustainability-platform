-- CreateTable
CREATE TABLE "RewardTier" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "greekName" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "pointsMin" INTEGER NOT NULL,
    "pointsMax" INTEGER,

    CONSTRAINT "RewardTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardTierRole" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameEl" TEXT NOT NULL,
    "nameDe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionEl" TEXT NOT NULL,
    "descriptionDe" TEXT NOT NULL,
    "rewardsEn" TEXT NOT NULL,
    "rewardsEl" TEXT NOT NULL,
    "rewardsDe" TEXT NOT NULL,

    CONSTRAINT "RewardTierRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardTier_order_key" ON "RewardTier"("order");

-- CreateIndex
CREATE UNIQUE INDEX "RewardTierRole_tierId_role_key" ON "RewardTierRole"("tierId", "role");

-- AddForeignKey
ALTER TABLE "RewardTierRole" ADD CONSTRAINT "RewardTierRole_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "RewardTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

