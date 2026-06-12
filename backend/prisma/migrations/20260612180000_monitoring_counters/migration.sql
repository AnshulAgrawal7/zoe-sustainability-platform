-- CreateTable
CREATE TABLE "PageViewDaily" (
    "day" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PageViewDaily_pkey" PRIMARY KEY ("day","path")
);

-- CreateTable
CREATE TABLE "SiteVisitDaily" (
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteVisitDaily_pkey" PRIMARY KEY ("day")
);

