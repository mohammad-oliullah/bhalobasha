CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "ListingType",
    "tenantPolicy" "TenantPolicy",
    "genderPreference" "GenderPreference",
    "areaId" INTEGER,
    "upazilaId" INTEGER,
    "districtId" INTEGER,
    "divisionId" INTEGER,
    "minRent" INTEGER,
    "maxRent" INTEGER,
    "isFurnished" BOOLEAN NOT NULL DEFAULT false,
    "utilitiesIncluded" BOOLEAN NOT NULL DEFAULT false,
    "alertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedSearch_userId_idx" ON "SavedSearch"("userId");
CREATE INDEX "SavedSearch_alertsEnabled_idx" ON "SavedSearch"("alertsEnabled");

ALTER TABLE "SavedSearch"
ADD CONSTRAINT "SavedSearch_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
