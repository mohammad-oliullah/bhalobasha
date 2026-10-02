/*
  Warnings:

  - Added the required column `type` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AreaType" AS ENUM ('UNION', 'WARD');

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "type" "AreaType" NOT NULL;
