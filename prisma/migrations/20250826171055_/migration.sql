/*
  Warnings:

  - A unique constraint covering the columns `[lapId,segmentId]` on the table `LapEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LapEvent_lapId_segmentId_key" ON "public"."LapEvent"("lapId", "segmentId");
