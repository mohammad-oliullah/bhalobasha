/*
  Warnings:

  - Added the required column `upazilaId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_areaId_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "upazilaId" INTEGER NOT NULL,
ALTER COLUMN "areaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
