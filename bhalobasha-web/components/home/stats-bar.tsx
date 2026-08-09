import { MapPin, Shield } from "lucide-react";

interface StatsBarProps {
  listingCount: number;
  areaCount: number;
}

export function StatsBar({ listingCount, areaCount }: StatsBarProps) {
  return (
    <section className="border-y border-gray-100 bg-white py-8">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{listingCount}+</p>
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
  );
}
