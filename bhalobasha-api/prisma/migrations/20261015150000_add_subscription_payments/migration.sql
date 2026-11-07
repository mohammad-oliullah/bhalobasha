CREATE TYPE "SubscriptionPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

ALTER TABLE "User"
ADD COLUMN "subscriptionExpiresAt" TIMESTAMP(3);

CREATE TABLE "SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "tranId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "status" "SubscriptionPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "valId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SubscriptionPayment_tranId_key" ON "SubscriptionPayment"("tranId");
CREATE INDEX "SubscriptionPayment_userId_createdAt_idx" ON "SubscriptionPayment"("userId", "createdAt");
CREATE INDEX "SubscriptionPayment_status_idx" ON "SubscriptionPayment"("status");

ALTER TABLE "SubscriptionPayment"
ADD CONSTRAINT "SubscriptionPayment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
