import { Badge } from "@/components/ui/badge";
import { Gavel } from "lucide-react";
import {
  GENDER_LABELS,
  LISTING_TYPE_COLORS,
  LISTING_TYPE_LABELS,
  TENANT_POLICY_LABELS,
} from "@/lib/utils/constants";
import { formatBDT } from "@/lib/utils/format";
import { Listing } from "@/types";

export function ListingHeader({ listing }: { listing: Listing }) {
  return (
    <>
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
        {listing.isBiddingEnabled && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Gavel className="h-3 w-3 mr-1" />
            Bidding Open
          </Badge>
        )}
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
    </>
  );
}
