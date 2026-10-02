/*
  Warnings:

  - Added the required column `type` to the `Upazila` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UpazilaType" AS ENUM ('UPAZILA', 'THANA');

-- AlterTable
ALTER TABLE "Upazila" ADD COLUMN     "type" "UpazilaType" NOT NULL;
