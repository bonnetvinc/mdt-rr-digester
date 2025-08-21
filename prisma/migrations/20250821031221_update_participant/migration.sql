/*
  Warnings:

  - You are about to drop the column `teamId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Participant" DROP CONSTRAINT "Participant_teamId_fkey";

-- AlterTable
ALTER TABLE "public"."Participant" DROP COLUMN "teamId",
ADD COLUMN     "contest" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "team" TEXT;

-- DropTable
DROP TABLE "public"."Team";
