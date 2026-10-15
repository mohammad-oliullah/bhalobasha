"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingFiltersPanel } from "@/components/listings/listing-filters";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useListings } from "@/lib/hooks/use-listings";
import { useCreateSavedSearch } from "@/lib/hooks/use-saved-searches";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  GenderPreference,
  ListingFilters,
  ListingType,
  TenantPolicy,
} from "@/types";
import { LISTINGS_PER_PAGE } from "@/lib/utils/constants";
import { ChevronLeft, ChevronRight, Save, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

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
    upazilaId: params.get("upazilaId")
      ? Number(params.get("upazilaId"))
      : undefined,
    districtId: params.get("districtId")
      ? Number(params.get("districtId"))
      : undefined,
    divisionId: params.get("divisionId")
      ? Number(params.get("divisionId"))
      : undefined,
    minRent: params.get("minRent") ? Number(params.get("minRent")) : undefined,
    maxRent: params.get("maxRent") ? Number(params.get("maxRent")) : undefined,
    isFurnished: params.get("isFurnished") === "true" || undefined,
    utilitiesIncluded: params.get("utilitiesIncluded") === "true" || undefined,
  };
}

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("My saved search");
  const createSavedSearch = useCreateSavedSearch();
  const { isAuthenticated, user } = useAuth();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const apiFilters: ListingFilters = {
    type: filters.type,
    tenantPolicy: filters.tenantPolicy,
    genderPreference: filters.genderPreference,
    areaId: filters.areaId,
    upazilaId: filters.upazilaId,
    districtId: filters.districtId,
    divisionId: filters.divisionId,
    minRent: filters.minRent,
    maxRent: filters.maxRent,
    isFurnished: filters.isFurnished,
    utilitiesIncluded: filters.utilitiesIncluded,
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

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / LISTINGS_PER_PAGE),
  );
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
      if (newFilters.upazilaId)
        params.set("upazilaId", String(newFilters.upazilaId));
      if (newFilters.districtId)
        params.set("districtId", String(newFilters.districtId));
      if (newFilters.divisionId)
        params.set("divisionId", String(newFilters.divisionId));
      if (newFilters.minRent) params.set("minRent", String(newFilters.minRent));
      if (newFilters.maxRent) params.set("maxRent", String(newFilters.maxRent));
      if (newFilters.isFurnished) params.set("isFurnished", "true");
      if (newFilters.utilitiesIncluded) params.set("utilitiesIncluded", "true");
      setPage(1);
      router.push(`/listings?${params.toString()}`);
    },
    [router],
  );

  const saveCurrentSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createSavedSearch.mutateAsync({
        name: searchName,
        ...apiFilters,
      });
      setSaveDialogOpen(false);
      toast.success("Saved search created. Email alerts are on.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save this search",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Listings</h1>
          <p className="text-muted">{filtered.length} টি বাসা পাওয়া গেছে</p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>
              <Save className="h-4 w-4" />
              Save search
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">Sign in to save</Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save this search</DialogTitle>
            <DialogDescription>
              We’ll email you when a new active listing matches these filters.
              {user?.email
                ? ` Alerts will go to ${user.email}.`
                : " Add an email address to your profile to use alerts."}
            </DialogDescription>
          </DialogHeader>
          {!user?.email && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">Add an email address</Link>
            </Button>
          )}
          <form className="space-y-4" onSubmit={saveCurrentSearch}>
            <Input
              aria-label="Search name"
              maxLength={100}
              required
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="e.g. Flats in Mirpur"
            />
            <Button
              className="w-full"
              type="submit"
              disabled={
                createSavedSearch.isPending || !searchName.trim() || !user?.email
              }
            >
              {createSavedSearch.isPending ? "Saving..." : "Save search"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex gap-8">
        <aside
          className={`w-full shrink-0 lg:w-72 ${
            showMobileFilters ? "block" : "hidden lg:block"
          }`}
        >
          <div className="sticky top-20 rounded-xl border border-border bg-card p-5 shadow-sm">
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
