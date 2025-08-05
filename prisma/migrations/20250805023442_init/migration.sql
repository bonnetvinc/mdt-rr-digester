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
    "startTimestamp" DOUBLE PRECISION NOT NULL,
    "endTimestamp" DOUBLE PRECISION,
    "participantId" INTEGER NOT NULL,

    CONSTRAINT "Lap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Segment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_transponder_key" ON "public"."Team"("transponder");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_bib_key" ON "public"."Participant"("bib");

-- CreateIndex
CREATE INDEX "Lap_participantId_startTimestamp_idx" ON "public"."Lap"("participantId", "startTimestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_name_key" ON "public"."Segment"("name");

-- CreateIndex
CREATE INDEX "_LapSegment_B_index" ON "public"."_LapSegment"("B");

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lap" ADD CONSTRAINT "Lap_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LapSegment" ADD CONSTRAINT "_LapSegment_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Lap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LapSegment" ADD CONSTRAINT "_LapSegment_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
