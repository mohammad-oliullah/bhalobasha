/*
  Warnings:

  - You are about to drop the column `thanaId` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the `Thana` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `upazilaId` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_thanaId_fkey";

-- DropForeignKey
ALTER TABLE "Thana" DROP CONSTRAINT "Thana_districtId_fkey";

-- DropIndex
DROP INDEX "Area_thanaId_idx";

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "thanaId",
ADD COLUMN     "upazilaId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Thana";

-- CreateTable
CREATE TABLE "Upazila" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "Upazila_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Upazila_districtId_idx" ON "Upazila"("districtId");

-- CreateIndex
CREATE INDEX "Area_upazilaId_idx" ON "Area"("upazilaId");

-- AddForeignKey
ALTER TABLE "Upazila" ADD CONSTRAINT "Upazila_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
