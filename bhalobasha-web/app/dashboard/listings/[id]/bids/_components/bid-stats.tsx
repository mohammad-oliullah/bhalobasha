import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Clock } from "lucide-react";
import { formatBDT } from "@/lib/utils/format";
import { Bid } from "@/types";

interface BidStatsProps {
  bids: Bid[];
  highestBid: number | null;
}

export function BidStats({ bids, highestBid }: BidStatsProps) {
  const pendingCount = bids.filter((b) => b.status === "PENDING").length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted">Total Bids</p>
            <p className="text-xl font-bold">{bids.length}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-xs text-muted">Highest</p>
            <p className="text-xl font-bold">
              {highestBid ? formatBDT(highestBid) : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Clock className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-xs text-muted">Pending</p>
            <p className="text-xl font-bold">{pendingCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
