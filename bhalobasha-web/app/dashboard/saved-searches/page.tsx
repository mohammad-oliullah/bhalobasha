"use client";

import Link from "next/link";
import { BellRing, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useDeleteSavedSearch, useSavedSearches, useUpdateSavedSearchAlerts } from "@/lib/hooks/use-saved-searches";
import { SavedSearch } from "@/types";

function filtersToHref(search: SavedSearch): string {
  const params = new URLSearchParams();
  const keys = [
    "type",
    "tenantPolicy",
    "genderPreference",
    "areaId",
    "upazilaId",
    "districtId",
    "divisionId",
    "minRent",
    "maxRent",
  ] as const;
  for (const key of keys) {
    const value = search[key];
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  if (search.isFurnished) params.set("isFurnished", "true");
  if (search.utilitiesIncluded) params.set("utilitiesIncluded", "true");
  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}

function describeSearch(search: SavedSearch): string {
  const details: string[] = [];
  if (search.type) details.push(search.type.replaceAll("_", " ").toLowerCase());
  if (search.areaId) details.push(`area ${search.areaId}`);
  else if (search.upazilaId) details.push(`upazila ${search.upazilaId}`);
  else if (search.districtId) details.push(`district ${search.districtId}`);
  else if (search.divisionId) details.push(`division ${search.divisionId}`);
  if (search.minRent !== undefined || search.maxRent !== undefined) {
    details.push(
      `rent ৳${search.minRent ?? 0}–৳${search.maxRent ?? "any"}`,
    );
  }
  if (search.isFurnished) details.push("furnished");
  if (search.utilitiesIncluded) details.push("utilities included");
  return details.length ? details.join(" · ") : "All active listings";
}

export default function SavedSearchesPage() {
  const { data: searches = [], isLoading } = useSavedSearches();
  const updateAlerts = useUpdateSavedSearchAlerts();
  const deleteSearch = useDeleteSavedSearch();

  const toggleAlerts = async (id: string, alertsEnabled: boolean) => {
    try {
      await updateAlerts.mutateAsync({ id, alertsEnabled });
      toast.success(alertsEnabled ? "Email alerts enabled" : "Email alerts paused");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update email alerts",
      );
    }
  };

  const removeSearch = async (id: string) => {
    try {
      await deleteSearch.mutateAsync(id);
      toast.success("Saved search deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete saved search",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BellRing className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Saved searches</h1>
          <p className="text-muted">
            Email alerts are sent when matching listings become available.
          </p>
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-muted/50" />
          <p className="text-muted">You haven’t saved any searches yet.</p>
          <Button asChild className="mt-4">
            <Link href="/listings">Browse listings</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <Card key={search.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="space-y-2">
                  <CardTitle>{search.name}</CardTitle>
                  <p className="text-sm capitalize text-muted">
                    {describeSearch(search)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${search.name}`}
                  disabled={deleteSearch.isPending}
                  onClick={() => void removeSearch(search.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-3 text-sm">
                  <Switch
                    checked={search.alertsEnabled}
                    disabled={updateAlerts.isPending}
                    onCheckedChange={(checked) =>
                      void toggleAlerts(search.id, checked)
                    }
                    aria-label={`${search.alertsEnabled ? "Pause" : "Enable"} email alerts for ${search.name}`}
                  />
                  Email alerts {search.alertsEnabled ? "on" : "off"}
                </label>
                <Button variant="outline" size="sm" asChild>
                  <Link href={filtersToHref(search)}>View matching listings</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
