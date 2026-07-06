"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useListings } from "@/lib/hooks/use-listings";
import {
  useDivisions,
  useDistricts,
  useThanas,
} from "@/lib/hooks/use-locations";
import { ListingStatus, ListingType } from "@/types";
import { LISTING_TYPE_LABELS } from "@/lib/utils/constants";

export default function HomePage() {
  const router = useRouter();
  const [divisionId, setDivisionId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [thanaId, setThanaId] = useState<number>();
  const [type, setType] = useState<ListingType>();
  const [minRent, setMinRent] = useState<string>("");
  const [maxRent, setMaxRent] = useState<string>("");

  const { data: divisions = [] } = useDivisions();
  const { data: districts = [] } = useDistricts(divisionId);
  const { data: thanas = [] } = useThanas(districtId);
  const { data: listings = [], isLoading } = useListings({
    status: ListingStatus.ACTIVE,
  });

  const recentListings = listings.slice(0, 6);
  const areaCount = new Set(listings.map((l) => l.areaId)).size;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (divisionId) params.set("divisionId", String(divisionId));
    if (districtId) params.set("districtId", String(districtId));
    if (thanaId) params.set("thanaId", String(thanaId));
    if (type) params.set("type", type);
    if (minRent) params.set("minRent", minRent);
    if (maxRent) params.set("maxRent", maxRent);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-primary-light to-background px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            আপনার ভালো বাসা খুঁজে নিন
          </h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">
            Find your perfect home in Bangladesh — flats, rooms, sublets &amp;
            bachelor seats
          </p>

          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5 text-left">
                <Label>Division</Label>
                <Select
                  value={divisionId?.toString() || ""}
                  onValueChange={(v) => {
                    setDivisionId(v ? Number(v) : undefined);
                    setDistrictId(undefined);
                    setThanaId(undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.nameBn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {divisionId && (
                <div className="space-y-1.5 text-left">
                  <Label>District</Label>
                  <Select
                    value={districtId?.toString() || ""}
                    onValueChange={(v) => {
                      setDistrictId(v ? Number(v) : undefined);
                      setThanaId(undefined);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {districtId && (
                <div className="space-y-1.5 text-left">
                  <Label>Thana</Label>
                  <Select
                    value={thanaId?.toString() || ""}
                    onValueChange={(v) =>
                      setThanaId(v ? Number(v) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select thana" />
                    </SelectTrigger>
                    <SelectContent>
                      {thanas.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <Label>Type</Label>
                <Select
                  value={type || ""}
                  onValueChange={(v) =>
                    setType(v ? (v as ListingType) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ListingType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {LISTING_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 text-left">
                <Label>Min Rent</Label>
                <Input
                  type="number"
                  placeholder="৳ 0"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label>Max Rent</Label>
                <Input
                  type="number"
                  placeholder="৳ 50,000"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                />
              </div>
            </div>

            <Button className="mt-4 w-full sm:w-auto" size="lg" onClick={handleSearch}>
              <Search className="h-5 w-5" />
              Search Homes
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{listings.length}+</p>
            <p className="text-sm text-muted">Listings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{areaCount || 10}+</p>
            <p className="text-sm text-muted flex items-center justify-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Areas
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
              <Shield className="h-5 w-5" /> Free
            </p>
            <p className="text-sm text-muted">Broker free</p>
          </div>
        </div>
      </section>

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
        <ListingGrid listings={recentListings} isLoading={isLoading} />
      </section>

      <section className="bg-primary px-4 py-12 text-center text-white">
        <Home className="mx-auto mb-4 h-10 w-10" />
        <h2 className="text-2xl font-bold">Have a property to rent?</h2>
        <p className="mt-2 opacity-90">List your flat, room, or mess for free</p>
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="mt-6 bg-white text-primary hover:bg-white/90"
        >
          <a href="/dashboard/listings/new">Post a Listing</a>
        </Button>
      </section>
    </div>
  );
}
