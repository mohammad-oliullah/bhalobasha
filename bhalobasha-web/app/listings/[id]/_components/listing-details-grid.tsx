import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Building, Sofa, Zap } from "lucide-react";
import { Listing } from "@/types";

export function ListingDetailsGrid({ listing }: { listing: Listing }) {
  return (
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
            <p className="font-semibold">
              {listing.isFurnished ? "Yes" : "No"}
            </p>
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
  );
}
