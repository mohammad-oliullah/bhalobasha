"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  useMyListings,
  useDeleteListing,
  useMarkListingFilled,
} from "@/lib/hooks/use-listings";
import {
  LISTING_STATUS_COLORS,
  LISTING_STATUS_LABELS,
  LISTING_TYPE_LABELS,
} from "@/lib/utils/constants";
import { formatBDT } from "@/lib/utils/format";
import { Pencil, Trash2, CheckCircle, PlusCircle } from "lucide-react";

export default function MyListingsPage() {
  const { user } = useAuth();
  const { data: listings = [], isLoading } = useMyListings(user?.id);
  const deleteListing = useDeleteListing();
  const markFilled = useMarkListingFilled();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteListing.mutateAsync(id);
      toast.success("Listing deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleMarkFilled = async (id: string) => {
    try {
      await markFilled.mutateAsync(id);
      toast.success("Listing marked as filled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted">Manage your property listings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <PlusCircle className="h-4 w-4" />
            Post New
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="text-muted">You haven&apos;t posted any listings yet.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/listings/new">Post your first listing</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <Badge className={LISTING_STATUS_COLORS[listing.status]}>
                    {LISTING_STATUS_LABELS[listing.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {LISTING_TYPE_LABELS[listing.type]} ·{" "}
                  {listing.area.nameBn}, {listing.area.thana.nameBn}
                </p>
                <p className="mt-1 font-semibold text-primary">
                  {formatBDT(listing.rent)}/month
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/listings/${listing.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                {listing.status === "ACTIVE" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMarkFilled(listing.id)}
                    disabled={markFilled.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Filled
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(listing.id)}
                  disabled={deleteListing.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
