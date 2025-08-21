-- CreateEnum
CREATE TYPE "public"."SegmentType" AS ENUM ('START', 'FINISH', 'BONUS');

-- CreateTable
CREATE TABLE "public"."Participant" (
    "id" SERIAL NOT NULL,
    "bib" INTEGER NOT NULL,
    "name" TEXT,
    "team" TEXT,
    "contest" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lap" (
    "id" SERIAL NOT NULL,
    "startTimestamp" DOUBLE PRECISION NOT NULL,
    "endTimestamp" DOUBLE PRECISION,
    "participantId" INTEGER NOT NULL,

    CONSTRAINT "Lap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Segment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."SegmentType" NOT NULL,
    "equipmentId" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "distance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "elevation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT 'gray',

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LapEvent" (
    "id" SERIAL NOT NULL,
    "lapId" INTEGER NOT NULL,
    "segmentId" INTEGER NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LapEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipment" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_bib_key" ON "public"."Participant"("bib");

-- CreateIndex
CREATE INDEX "Lap_participantId_startTimestamp_idx" ON "public"."Lap"("participantId", "startTimestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_name_key" ON "public"."Segment"("name");

-- AddForeignKey
ALTER TABLE "public"."Lap" ADD CONSTRAINT "Lap_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_lapId_fkey" FOREIGN KEY ("lapId") REFERENCES "public"."Lap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "public"."Segment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
