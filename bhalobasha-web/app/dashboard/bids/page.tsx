"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useMyBids } from "@/lib/hooks/use-bids";
import { MyBidList } from "./_components/my-bid-list";

export default function MyBidsPage() {
  const { data: bids = [], isLoading } = useMyBids();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bids</h1>
        <p className="text-muted">Track all your bids across listings</p>
      </div>
      <MyBidList bids={bids} />
    </div>
  );
}
