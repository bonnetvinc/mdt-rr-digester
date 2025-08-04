/*
  Warnings:

  - Made the column `equipmentId` on table `Segment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Segment" DROP CONSTRAINT "Segment_equipmentId_fkey";

-- AlterTable
ALTER TABLE "public"."Segment" ALTER COLUMN "equipmentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
