-- CreateEnum
CREATE TYPE "public"."Equipment" AS ENUM ('START', 'FINISH', 'DUAL', 'EXPERT', 'ROCKGARDEN', 'ONEORTWO');

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
CREATE TABLE "public"."LapEvent" (
    "id" SERIAL NOT NULL,
    "lapId" INTEGER NOT NULL,
    "equipment" "public"."Equipment" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bonusId" INTEGER,

    CONSTRAINT "LapEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bonus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipment" "public"."Equipment" NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "LapEvent_lapId_equipment_idx" ON "public"."LapEvent"("lapId", "equipment");

-- CreateIndex
CREATE UNIQUE INDEX "Bonus_name_key" ON "public"."Bonus"("name");

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lap" ADD CONSTRAINT "Lap_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_lapId_fkey" FOREIGN KEY ("lapId") REFERENCES "public"."Lap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "public"."Bonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
