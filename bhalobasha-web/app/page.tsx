"use client";

import { HeroSearch } from "@/components/home/hero-search";
import { StatsBar } from "@/components/home/stats-bar";
import { useListings } from "@/lib/hooks/use-listings";
import { ListingStatus } from "@/types";
import { RecentListings } from "./../components/home/recent-listings";
import { CtaBanner } from "./../components/home/cta-banner";
import { RentCalculator } from "@/components/home/rent-calculator";

export default function HomePage() {
  const { data: listings = [], isLoading } = useListings({
    status: ListingStatus.ACTIVE,
  });

  const recentListings = listings.slice(0, 6);
  const areaCount = new Set(listings.map((l) => l.areaId)).size;

  return (
    <div>
      <HeroSearch />
      <StatsBar listingCount={listings.length} areaCount={areaCount} />
      <RecentListings listings={recentListings} isLoading={isLoading} />
      <RentCalculator />
      <CtaBanner />
    </div>
  );
}
