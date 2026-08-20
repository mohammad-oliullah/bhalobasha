"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useMyFavorites } from "@/lib/hooks/use-favorites";

export default function FavoritesPage() {
  const { data: favorites = [], isLoading } = useMyFavorites();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <div>
          <h1 className="text-2xl font-bold">Saved Listings</h1>
          <p className="text-muted">
            {favorites.length} listing{favorites.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <Heart className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-muted">No saved listings yet.</p>
          <Button asChild className="mt-4">
            <Link href="/listings">Browse Listings</Link>
          </Button>
        </div>
      ) : (
        <ListingGrid listings={favorites} />
      )}
    </div>
  );
}
