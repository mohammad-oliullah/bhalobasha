"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Listing } from "@/types";
import {
  LISTING_TYPE_COLORS,
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { formatBDT, formatDate, isFutureDate } from "@/lib/utils/format";
import { Home, Zap } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const primaryPhoto =
    listing.photos.find((p) => p.isPrimary) || listing.photos[0];

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.url}
              alt={listing.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <Home className="h-12 w-12 opacity-30" />
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <Badge
              variant="custom"
              className={LISTING_TYPE_COLORS[listing.type]}
            >
              {LISTING_TYPE_LABELS[listing.type].split(" / ")[0]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {TENANT_POLICY_LABELS[listing.tenantPolicy].split(" / ")[0]}
            </Badge>
            {listing.isFurnished && (
              <Badge variant="outline" className="text-xs">
                Furnished
              </Badge>
            )}
            {listing.utilitiesIncluded && (
              <Badge
                variant="outline"
                className="flex items-center gap-0.5 text-xs"
              >
                <Zap className="h-3 w-3" />
                Utilities
              </Badge>
            )}
          </div>
          <h3 className="truncate font-semibold text-foreground">
            {listing.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {listing.area.nameBn || listing.area.name},{" "}
            {listing.area.thana.nameBn || listing.area.thana.name}
          </p>
          <p className="mt-2 text-lg font-bold text-primary">
            {formatBDT(listing.rent)}
            <span className="text-sm font-normal text-muted">/month</span>
          </p>
          {isFutureDate(listing.availableFrom) && (
            <p className="mt-1 text-xs text-accent">
              Available from {formatDate(listing.availableFrom)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
