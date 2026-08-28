import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { Listing } from "@/types";

export function ListingLocation({ listing }: { listing: Listing }) {
  const location = listing.area;
  return (
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
      {listing.latitude != null && listing.longitude != null && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`,
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <MapPin className="h-4 w-4" />
          View on map
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      )}
      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
        <Calendar className="h-4 w-4" />
        Available from {formatDate(listing.availableFrom)}
      </p>
    </div>
  );
}
