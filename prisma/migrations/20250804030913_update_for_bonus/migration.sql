/*
  Warnings:

  - You are about to drop the `Bonus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LapEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LapEvent" DROP CONSTRAINT "LapEvent_bonusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LapEvent" DROP CONSTRAINT "LapEvent_lapId_fkey";

-- DropTable
DROP TABLE "public"."Bonus";

-- DropTable
DROP TABLE "public"."LapEvent";

-- DropEnum
DROP TYPE "public"."Equipment";

-- CreateTable
CREATE TABLE "public"."Segment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipmentId" TEXT,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipment" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_LapSegment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LapSegment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Segment_name_key" ON "public"."Segment"("name");

-- CreateIndex
CREATE INDEX "_LapSegment_B_index" ON "public"."_LapSegment"("B");

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LapSegment" ADD CONSTRAINT "_LapSegment_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Lap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LapSegment" ADD CONSTRAINT "_LapSegment_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
