"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Clock3, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import { useModerateListing, usePendingListings } from "@/lib/hooks/use-listings";
import { formatBDT } from "@/lib/utils/format";
import { Listing, UserRole } from "@/types";

function PendingListingCard({
  listing,
  onModerate,
  isPending,
}: {
  listing: Listing;
  onModerate: (
    id: string,
    action: "approve" | "reject",
    reason?: string,
  ) => Promise<boolean>;
  isPending: boolean;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const photo = listing.photos.find((item) => item.isPrimary) ?? listing.photos[0];

  const submitRejection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setReasonError("Enter a reason before rejecting this listing.");
      return;
    }

    if (trimmedReason.length > 1000) {
      setReasonError("The reason must be 1000 characters or fewer.");
      return;
    }

    if (await onModerate(listing.id, "reject", trimmedReason)) {
      setRejecting(false);
      setReason("");
      setReasonError("");
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row">
        {photo && (
          <div className="relative h-44 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-56">
            <Image
              src={photo.url}
              alt={listing.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{listing.title}</h2>
            <Badge className="bg-yellow-100 text-yellow-800">Pending review</Badge>
          </div>
          <p className="font-semibold text-primary">{formatBDT(listing.rent)}/month</p>
          <p className="line-clamp-3 text-sm text-muted">{listing.description}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Owner</dt>
              <dd>{listing.owner.name || "Unnamed"} · {listing.owner.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Address</dt>
              <dd>{listing.address}</dd>
            </div>
            <div>
              <dt className="text-muted">Submitted</dt>
              <dd>{new Date(listing.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              onClick={() => onModerate(listing.id, "approve")}
              disabled={isPending}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => setRejecting((open) => !open)}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
              {rejecting ? "Cancel rejection" : "Reject"}
            </Button>
          </div>
          {rejecting && (
            <form onSubmit={submitRejection} className="space-y-2">
              <label
                htmlFor={`rejection-reason-${listing.id}`}
                className="block text-sm font-medium"
              >
                Reason for rejection
              </label>
              <textarea
                id={`rejection-reason-${listing.id}`}
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setReasonError("");
                }}
                maxLength={1000}
                rows={3}
                required
                aria-invalid={!!reasonError}
                aria-describedby={
                  reasonError ? `rejection-error-${listing.id}` : undefined
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Explain what needs to be corrected"
              />
              <div className="flex items-center justify-between gap-3">
                {reasonError ? (
                  <p
                    id={`rejection-error-${listing.id}`}
                    className="text-sm text-destructive"
                  >
                    {reasonError}
                  </p>
                ) : (
                  <span className="text-xs text-muted">
                    {reason.length}/1000 characters
                  </span>
                )}
                <Button type="submit" variant="destructive" disabled={isPending}>
                  {isPending ? "Rejecting..." : "Confirm rejection"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminModerationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const { data: listings = [], isLoading, isError } = usePendingListings(isAdmin);
  const moderate = useModerateListing();

  const handleModerate = async (
    id: string,
    action: "approve" | "reject",
    reason?: string,
  ) => {
    try {
      await moderate.mutateAsync({ id, action, reason });
      toast.success(action === "approve" ? "Listing approved" : "Listing rejected");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update listing");
      return false;
    }
  };

  if (!isAdmin) {
    return <p className="py-16 text-center text-muted">Admin access required.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Listing moderation</h1>
        <p className="text-muted">Review new listings before they go public.</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted">
        <Clock3 className="h-4 w-4" />
        {listings.length} {listings.length === 1 ? "listing" : "listings"} awaiting review
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-lg border border-destructive/30 p-5 text-sm text-destructive">
          Could not load the moderation queue. Please refresh and try again.
        </p>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted">
          The moderation queue is clear.
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing: Listing) => (
            <PendingListingCard
              key={listing.id}
              listing={listing}
              onModerate={handleModerate}
              isPending={moderate.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
