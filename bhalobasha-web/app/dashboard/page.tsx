"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import { useMyListings } from "@/lib/hooks/use-listings";
import { LISTING_STATUS_COLORS, LISTING_STATUS_LABELS } from "@/lib/utils/constants";
import { ListingStatus } from "@/types";
import { formatBDT } from "@/lib/utils/format";
import { PlusCircle, Home, CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: listings = [], isLoading } = useMyListings(user?.id);

  const total = listings.length;
  const active = listings.filter((l) => l.status === ListingStatus.ACTIVE).length;
  const filled = listings.filter((l) => l.status === ListingStatus.FILLED).length;
  const recent = listings.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted">
            Welcome back, {user?.name || user?.phone}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <PlusCircle className="h-4 w-4" />
            Post New Listing
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Total Listings
            </CardTitle>
            <Home className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Active
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Filled
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{filled}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-8 text-center text-muted">
              <p>No listings yet.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/listings/new">Post your first listing</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted">
                    <th className="pb-3 pr-4 font-medium">Title</th>
                    <th className="pb-3 pr-4 font-medium">Rent</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((listing) => (
                    <tr key={listing.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{listing.title}</td>
                      <td className="py-3 pr-4">{formatBDT(listing.rent)}</td>
                      <td className="py-3 pr-4">
                        <Badge className={LISTING_STATUS_COLORS[listing.status]}>
                          {LISTING_STATUS_LABELS[listing.status]}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/listings/${listing.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
