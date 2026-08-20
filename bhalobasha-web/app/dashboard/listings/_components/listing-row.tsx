"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import {
  useDeleteListing,
  useMarkListingFilled,
  useMarkListingUnFilled,
} from "@/lib/hooks/use-listings";
import {
  LISTING_STATUS_COLORS,
  LISTING_STATUS_LABELS,
  LISTING_TYPE_LABELS,
} from "@/lib/utils/constants";
import { formatBDT } from "@/lib/utils/format";
import { Listing } from "@/types";
import { Pencil, Trash2, CheckCircle, RotateCcw } from "lucide-react";

export function ListingRow({ listing }: { listing: Listing }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const deleteListing = useDeleteListing();
  const markFilled = useMarkListingFilled();
  const markUnFilled = useMarkListingUnFilled();

  const handleDelete = async () => {
    try {
      await deleteListing.mutateAsync(listing.id);
      toast.success("Listing deleted");
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleMarkFilled = async () => {
    try {
      await markFilled.mutateAsync(listing.id);
      toast.success("Listing marked as filled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleMarkUnFilled = async () => {
    try {
      await markUnFilled.mutateAsync(listing.id);
      toast.success("Listing marked as available again");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{listing.title}</h3>
            <Badge className={LISTING_STATUS_COLORS[listing.status]}>
              {LISTING_STATUS_LABELS[listing.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {LISTING_TYPE_LABELS[listing.type]} · {listing.area.nameBn},{" "}
            {listing.area.thana.nameBn}
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
              onClick={handleMarkFilled}
              disabled={markFilled.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              {markFilled.isPending ? "Updating..." : "Mark Filled"}
            </Button>
          )}

          {listing.status === "FILLED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkUnFilled}
              disabled={markUnFilled.isPending}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <RotateCcw className="h-4 w-4" />
              {markUnFilled.isPending ? "Updating..." : "Mark Available"}
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isPending={deleteListing.isPending}
        title={listing.title}
      />
    </>
  );
}
