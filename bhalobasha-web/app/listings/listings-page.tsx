"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingFiltersPanel } from "@/components/listings/listing-filters";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { useListings } from "@/lib/hooks/use-listings";
import {
  GenderPreference,
  ListingFilters,
  ListingStatus,
  ListingType,
  TenantPolicy,
} from "@/types";
import { LISTINGS_PER_PAGE } from "@/lib/utils/constants";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

type ExtendedFilters = ListingFilters & {
  isFurnished?: boolean;
  utilitiesIncluded?: boolean;
};

function parseFilters(params: URLSearchParams): ExtendedFilters {
  return {
    type: (params.get("type") as ListingType) || undefined,
    tenantPolicy: (params.get("tenantPolicy") as TenantPolicy) || undefined,
    genderPreference:
      (params.get("genderPreference") as GenderPreference) || undefined,
    areaId: params.get("areaId") ? Number(params.get("areaId")) : undefined,
    thanaId: params.get("thanaId") ? Number(params.get("thanaId")) : undefined,
    districtId: params.get("districtId")
      ? Number(params.get("districtId"))
      : undefined,
    divisionId: params.get("divisionId")
      ? Number(params.get("divisionId"))
      : undefined,
    minRent: params.get("minRent") ? Number(params.get("minRent")) : undefined,
    maxRent: params.get("maxRent") ? Number(params.get("maxRent")) : undefined,
    status: ListingStatus.ACTIVE,
    isFurnished: params.get("isFurnished") === "true" || undefined,
    utilitiesIncluded: params.get("utilitiesIncluded") === "true" || undefined,
  };
}

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );

  const apiFilters: ListingFilters = {
    type: filters.type,
    tenantPolicy: filters.tenantPolicy,
    genderPreference: filters.genderPreference,
    areaId: filters.areaId,
    thanaId: filters.thanaId,
    districtId: filters.districtId,
    divisionId: filters.divisionId,
    minRent: filters.minRent,
    maxRent: filters.maxRent,
    status: ListingStatus.ACTIVE,
  };

  const { data: listings = [], isLoading } = useListings(apiFilters);

  const filtered = useMemo(() => {
    let result = listings;
    if (filters.isFurnished) {
      result = result.filter((l) => l.isFurnished);
    }
    if (filters.utilitiesIncluded) {
      result = result.filter((l) => l.utilitiesIncluded);
    }
    return result;
  }, [listings, filters.isFurnished, filters.utilitiesIncluded]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / LISTINGS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * LISTINGS_PER_PAGE,
    page * LISTINGS_PER_PAGE,
  );

  const updateFilters = useCallback(
    (newFilters: ExtendedFilters) => {
      const params = new URLSearchParams();
      if (newFilters.type) params.set("type", newFilters.type);
      if (newFilters.tenantPolicy)
        params.set("tenantPolicy", newFilters.tenantPolicy);
      if (newFilters.genderPreference)
        params.set("genderPreference", newFilters.genderPreference);
      if (newFilters.areaId) params.set("areaId", String(newFilters.areaId));
      if (newFilters.thanaId) params.set("thanaId", String(newFilters.thanaId));
      if (newFilters.districtId)
        params.set("districtId", String(newFilters.districtId));
      if (newFilters.divisionId)
        params.set("divisionId", String(newFilters.divisionId));
      if (newFilters.minRent) params.set("minRent", String(newFilters.minRent));
      if (newFilters.maxRent) params.set("maxRent", String(newFilters.maxRent));
      if (newFilters.isFurnished) params.set("isFurnished", "true");
      if (newFilters.utilitiesIncluded)
        params.set("utilitiesIncluded", "true");
      setPage(1);
      router.push(`/listings?${params.toString()}`);
    },
    [router],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Listings</h1>
          <p className="text-muted">
            {filtered.length} টি বাসা পাওয়া গেছে
          </p>
        </div>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-8">
        <aside
          className={`w-full shrink-0 lg:w-72 ${
            showMobileFilters ? "block" : "hidden lg:block"
          }`}
        >
          <div className="sticky top-20 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Filters</h2>
            <ListingFiltersPanel filters={filters} onChange={updateFilters} />
          </div>
        </aside>

        <div className="flex-1">
          <ListingGrid listings={paginated} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
