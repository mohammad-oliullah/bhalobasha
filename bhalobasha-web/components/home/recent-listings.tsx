import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Listing } from "@/types";

interface RecentListingsProps {
  listings: Listing[];
  isLoading: boolean;
}

export function RecentListings({ listings, isLoading }: RecentListingsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recent Listings</h2>
          <p className="text-muted">নতুন যোগ হওয়া বাসা</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/listings">View All</a>
        </Button>
      </div>
      <ListingGrid listings={listings} isLoading={isLoading} />
    </section>
  );
}
