/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Coureur` table. All the data in the column will be lost.
  - You are about to drop the column `dossard` on the `Coureur` table. All the data in the column will be lost.
  - You are about to drop the column `equipe` on the `Coureur` table. All the data in the column will be lost.
  - You are about to drop the `Passage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RawPassing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resultat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bib]` on the table `Coureur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bib` to the `Coureur` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Borne" AS ENUM ('START', 'FINISH', 'DUAL', 'EXPERT', 'ROCKGARDEN', 'ONEORTWO');

-- DropForeignKey
ALTER TABLE "public"."Passage" DROP CONSTRAINT "Passage_coureurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resultat" DROP CONSTRAINT "Resultat_coureurId_fkey";

-- DropIndex
DROP INDEX "public"."Coureur_dossard_key";

-- AlterTable
ALTER TABLE "public"."Coureur" DROP COLUMN "createdAt",
DROP COLUMN "dossard",
DROP COLUMN "equipe",
ADD COLUMN     "bib" INTEGER NOT NULL,
ADD COLUMN     "equipeId" INTEGER;

-- DropTable
DROP TABLE "public"."Passage";

-- DropTable
DROP TABLE "public"."RawPassing";

-- DropTable
DROP TABLE "public"."Resultat";

-- DropEnum
DROP TYPE "public"."LieuDePassage";

-- CreateTable
CREATE TABLE "public"."Equipe" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "transpondeur" INTEGER NOT NULL,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tours" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "lieu" "public"."Borne" NOT NULL,
    "coureurId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Source" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "borne" "public"."Borne" NOT NULL,
    "bonus" INTEGER NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_nom_key" ON "public"."Equipe"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_transpondeur_key" ON "public"."Equipe"("transpondeur");

-- CreateIndex
CREATE INDEX "Tours_coureurId_timestamp_idx" ON "public"."Tours"("coureurId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Source_nom_key" ON "public"."Source"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Coureur_bib_key" ON "public"."Coureur"("bib");

-- AddForeignKey
ALTER TABLE "public"."Coureur" ADD CONSTRAINT "Coureur_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "public"."Equipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tours" ADD CONSTRAINT "Tours_coureurId_fkey" FOREIGN KEY ("coureurId") REFERENCES "public"."Coureur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
