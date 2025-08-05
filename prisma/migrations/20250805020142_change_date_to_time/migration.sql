/*
  Warnings:

  - The `endTimestamp` column on the `Lap` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `startTimestamp` on the `Lap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Lap" DROP COLUMN "startTimestamp",
ADD COLUMN     "startTimestamp" DOUBLE PRECISION NOT NULL,
DROP COLUMN "endTimestamp",
ADD COLUMN     "endTimestamp" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Lap_participantId_startTimestamp_idx" ON "public"."Lap"("participantId", "startTimestamp");
