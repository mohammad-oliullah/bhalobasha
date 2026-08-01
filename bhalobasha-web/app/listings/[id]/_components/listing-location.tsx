import { Calendar, MapPin } from "lucide-react";
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
      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
        <Calendar className="h-4 w-4" />
        Available from {formatDate(listing.availableFrom)}
      </p>
    </div>
  );
}
