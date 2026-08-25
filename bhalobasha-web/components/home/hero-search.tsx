"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
import {
  useDivisions,
  useDistricts,
  useThanas,
} from "@/lib/hooks/use-locations";
import { ListingType } from "@/types";
import { LISTING_TYPE_LABELS } from "@/lib/utils/constants";

export function HeroSearch() {
  const router = useRouter();
  const [divisionId, setDivisionId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [thanaId, setThanaId] = useState<number>();
  const [type, setType] = useState<ListingType>();
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const { data: divisions = [] } = useDivisions();
  const { data: districts = [] } = useDistricts(divisionId);
  const { data: thanas = [] } = useThanas(districtId);

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
    <section className="bg-gradient-to-b from-primary-light to-background px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          আপনার ভালো বাসা খুঁজে নিন
        </h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">
          Find your perfect home in Bangladesh — flats, rooms, sublets &amp;
          bachelor seats
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
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
                  onValueChange={(v) => setThanaId(v ? Number(v) : undefined)}
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

          <Button
            className="mt-4 w-full sm:w-auto"
            size="lg"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            Search Homes
          </Button>
        </div>
      </div>
    </section>
  );
}
