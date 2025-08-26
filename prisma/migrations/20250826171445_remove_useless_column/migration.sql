/*
  Warnings:

  - You are about to drop the column `color` on the `Segment` table. All the data in the column will be lost.
  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `equipmentId` on table `Segment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Segment" DROP CONSTRAINT "Segment_equipmentId_fkey";

-- AlterTable
ALTER TABLE "public"."Segment" DROP COLUMN "color",
ALTER COLUMN "equipmentId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Equipment";
