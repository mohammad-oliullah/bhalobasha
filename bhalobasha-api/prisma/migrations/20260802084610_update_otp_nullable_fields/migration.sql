/*
  Warnings:

  - You are about to alter the column `phone` on the `OtpVerification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `code` on the `OtpVerification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "email" VARCHAR(255),
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(6);

-- CreateIndex
CREATE INDEX "OtpVerification_email_code_idx" ON "OtpVerification"("email", "code");
