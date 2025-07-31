/*
  Warnings:

  - You are about to drop the `Coureur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Source` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tours` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Equipment" AS ENUM ('START', 'FINISH', 'DUAL', 'EXPERT', 'ROCKGARDEN', 'ONEORTWO');

-- DropForeignKey
ALTER TABLE "public"."Coureur" DROP CONSTRAINT "Coureur_equipeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tours" DROP CONSTRAINT "Tours_coureurId_fkey";

-- DropTable
DROP TABLE "public"."Coureur";

-- DropTable
DROP TABLE "public"."Equipe";

-- DropTable
DROP TABLE "public"."Source";

-- DropTable
DROP TABLE "public"."Tours";

-- DropEnum
DROP TYPE "public"."Borne";

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "transponder" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Participant" (
    "id" SERIAL NOT NULL,
    "bib" INTEGER NOT NULL,
    "name" TEXT,
    "teamId" INTEGER,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lap" (
    "id" SERIAL NOT NULL,
    "startTimestamp" TIMESTAMP(3) NOT NULL,
    "endTimestamp" TIMESTAMP(3),
    "participantId" INTEGER NOT NULL,

    CONSTRAINT "Lap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bonus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipment" "public"."Equipment" NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_BonusToLap" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BonusToLap_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_transponder_key" ON "public"."Team"("transponder");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_bib_key" ON "public"."Participant"("bib");

-- CreateIndex
CREATE INDEX "Lap_participantId_startTimestamp_idx" ON "public"."Lap"("participantId", "startTimestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Bonus_name_key" ON "public"."Bonus"("name");

-- CreateIndex
CREATE INDEX "_BonusToLap_B_index" ON "public"."_BonusToLap"("B");

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lap" ADD CONSTRAINT "Lap_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BonusToLap" ADD CONSTRAINT "_BonusToLap_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Bonus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BonusToLap" ADD CONSTRAINT "_BonusToLap_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Lap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
