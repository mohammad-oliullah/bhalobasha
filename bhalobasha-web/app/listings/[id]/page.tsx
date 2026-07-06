"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingPhotos } from "@/components/listings/listing-photos";
import { ContactOwnerModal } from "@/components/listings/contact-owner-modal";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useListing, useListings } from "@/lib/hooks/use-listings";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  GENDER_LABELS,
  LISTING_TYPE_COLORS,
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { formatBDT, formatDate } from "@/lib/utils/format";
import { ListingStatus } from "@/types";
import {
  MapPin,
  Phone,
  Bed,
  Bath,
  Building,
  Sofa,
  Zap,
  Calendar,
  Pencil,
  CheckCircle,
} from "lucide-react";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading } = useListing(id);
  const { user, isAuthenticated } = useAuth();
  const [contactOpen, setContactOpen] = useState(false);

  const { data: allListings = [] } = useListings(
    listing
      ? {
          thanaId: listing.area.thanaId,
          type: listing.type,
          status: ListingStatus.ACTIVE,
        }
      : undefined,
  );

  const similar = allListings
    .filter((l) => l.id !== id)
    .slice(0, 3);

  const isOwner = user?.id === listing?.ownerId;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-lg font-medium">Listing not found</p>
        <Button asChild className="mt-4">
          <Link href="/listings">Back to listings</Link>
        </Button>
      </div>
    );
  }

  const location = listing.area;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <ListingPhotos photos={listing.photos} title={listing.title} />

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge className={LISTING_TYPE_COLORS[listing.type]}>
          {LISTING_TYPE_LABELS[listing.type]}
        </Badge>
        <Badge variant="secondary">
          {TENANT_POLICY_LABELS[listing.tenantPolicy]}
        </Badge>
        <Badge variant="outline">
          {GENDER_LABELS[listing.genderPreference]}
        </Badge>
      </div>

      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{listing.title}</h1>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <p className="text-3xl font-bold text-primary">
          {formatBDT(listing.rent)}
          <span className="text-base font-normal text-muted">/month</span>
        </p>
        {listing.advanceAmount && (
          <p className="text-muted">
            Advance: {formatBDT(listing.advanceAmount)}
            {listing.negotiable && (
              <span className="ml-2 text-accent">(Negotiable)</span>
            )}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {listing.totalRooms && (
          <Card>
            <CardContent className="flex items-center gap-2 p-4">
              <Bed className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted">Rooms</p>
                <p className="font-semibold">{listing.totalRooms}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {listing.totalBaths && (
          <Card>
            <CardContent className="flex items-center gap-2 p-4">
              <Bath className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted">Baths</p>
                <p className="font-semibold">{listing.totalBaths}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {listing.floor !== null && listing.floor !== undefined && (
          <Card>
            <CardContent className="flex items-center gap-2 p-4">
              <Building className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted">Floor</p>
                <p className="font-semibold">{listing.floor}</p>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="flex items-center gap-2 p-4">
            <Sofa className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted">Furnished</p>
              <p className="font-semibold">{listing.isFurnished ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2 p-4">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted">Utilities</p>
              <p className="font-semibold">
                {listing.utilitiesIncluded ? "Included" : "Not included"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-muted leading-relaxed">
          {listing.description}
        </p>
      </div>

      <div className="mt-8 rounded-xl bg-primary-light p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <MapPin className="h-5 w-5 text-primary" />
          Location
        </h2>
        <p className="mt-2 text-sm text-muted">
          {location.thana.district.division.nameBn} →{" "}
          {location.thana.district.nameBn} → {location.thana.nameBn} →{" "}
          {location.nameBn}
        </p>
        <p className="mt-1 font-medium">{listing.address}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Calendar className="h-4 w-4" />
          Available from {formatDate(listing.availableFrom)}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => setContactOpen(true)}>
          <Phone className="h-5 w-5" />
          Contact Owner
        </Button>
        {isOwner && (
          <>
            <Button asChild variant="outline" size="lg">
              <Link href={`/dashboard/listings/${listing.id}/edit`}>
                <Pencil className="h-5 w-5" />
                Edit Listing
              </Link>
            </Button>
            {listing.status === ListingStatus.ACTIVE && (
              <Button
                variant="secondary"
                size="lg"
                onClick={async () => {
                  try {
                    const { markListingFilled } = await import("@/lib/api/listings");
                    await markListingFilled(listing.id);
                    toast.success("Marked as filled");
                    window.location.reload();
                  } catch {
                    toast.error("Failed to update");
                  }
                }}
              >
                <CheckCircle className="h-5 w-5" />
                Mark as Filled
              </Button>
            )}
          </>
        )}
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold">Similar Listings</h2>
          <ListingGrid listings={similar} />
        </section>
      )}

      <ContactOwnerModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        contactPhone={listing.contactPhone}
        listingTitle={listing.title}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
