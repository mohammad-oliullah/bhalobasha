-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_villageId_fkey";

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "villageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE SET NULL ON UPDATE CASCADE;
