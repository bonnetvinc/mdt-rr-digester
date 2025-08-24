-- CreateTable
CREATE TABLE "public"."DisplaySettings" (
    "id" TEXT NOT NULL,
    "timerDelay" INTEGER NOT NULL DEFAULT 8000,
    "pageSize" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "DisplaySettings_pkey" PRIMARY KEY ("id")
);
