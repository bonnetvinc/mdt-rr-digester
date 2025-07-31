-- CreateEnum
CREATE TYPE "public"."LieuDePassage" AS ENUM ('FINISH', 'SPORT', 'EXPERT');

-- CreateTable
CREATE TABLE "public"."Coureur" (
    "id" SERIAL NOT NULL,
    "dossard" INTEGER NOT NULL,
    "nom" TEXT,
    "equipe" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coureur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Passage" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "lieu" "public"."LieuDePassage" NOT NULL,
    "coureurId" INTEGER NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resultat" (
    "id" SERIAL NOT NULL,
    "coureurId" INTEGER NOT NULL,
    "tours" INTEGER NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resultat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coureur_dossard_key" ON "public"."Coureur"("dossard");

-- CreateIndex
CREATE INDEX "Passage_coureurId_timestamp_idx" ON "public"."Passage"("coureurId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Resultat_coureurId_key" ON "public"."Resultat"("coureurId");

-- AddForeignKey
ALTER TABLE "public"."Passage" ADD CONSTRAINT "Passage_coureurId_fkey" FOREIGN KEY ("coureurId") REFERENCES "public"."Coureur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resultat" ADD CONSTRAINT "Resultat_coureurId_fkey" FOREIGN KEY ("coureurId") REFERENCES "public"."Coureur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
