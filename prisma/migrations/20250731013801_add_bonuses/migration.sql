/*
  Warnings:

  - You are about to drop the `_BonusToLap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_BonusToLap" DROP CONSTRAINT "_BonusToLap_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BonusToLap" DROP CONSTRAINT "_BonusToLap_B_fkey";

-- DropTable
DROP TABLE "public"."_BonusToLap";

-- CreateTable
CREATE TABLE "public"."LapEvent" (
    "id" SERIAL NOT NULL,
    "lapId" INTEGER NOT NULL,
    "equipment" "public"."Equipment" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bonusId" INTEGER,

    CONSTRAINT "LapEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LapEvent_lapId_equipment_idx" ON "public"."LapEvent"("lapId", "equipment");

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_lapId_fkey" FOREIGN KEY ("lapId") REFERENCES "public"."Lap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LapEvent" ADD CONSTRAINT "LapEvent_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "public"."Bonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
