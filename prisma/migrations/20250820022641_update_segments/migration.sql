/*
  Warnings:

  - You are about to drop the `_LapSegment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SegmentType" AS ENUM ('START', 'FINISH', 'BONUS');

-- DropForeignKey
ALTER TABLE "public"."Segment" DROP CONSTRAINT "Segment_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_LapSegment" DROP CONSTRAINT "_LapSegment_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_LapSegment" DROP CONSTRAINT "_LapSegment_B_fkey";

-- AlterTable
ALTER TABLE "public"."Segment" ADD COLUMN     "type" "public"."SegmentType" NOT NULL,
ALTER COLUMN "equipmentId" DROP NOT NULL,
ALTER COLUMN "points" SET DEFAULT 0;

-- DropTable
DROP TABLE "public"."_LapSegment";

-- CreateTable
CREATE TABLE "public"."LapEvent" (
    "id" SERIAL NOT NULL,
    "lapId" INTEGER NOT NULL,
    "segmentId" INTEGER NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LapEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_lapId_fkey" FOREIGN KEY ("lapId") REFERENCES "public"."Lap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "public"."Segment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
