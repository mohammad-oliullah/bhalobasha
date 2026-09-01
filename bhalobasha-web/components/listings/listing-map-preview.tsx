"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ListingMapPreviewProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  trigger?: "icon" | "button";
}

export function ListingMapPreview({
  latitude,
  longitude,
  title = "Test Location",
  trigger = "button",
}: ListingMapPreviewProps) {
  const [open, setOpen] = useState(false);
  console.log({ latitude, longitude });

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <>
      <Button
        type="button"
        variant={trigger === "icon" ? "ghost" : "outline"}
        size={trigger === "icon" ? "icon" : "sm"}
        aria-label="View listing location"
        title="View listing location"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <MapPin className="h-4 w-4" />

        {trigger === "button" && "View on map"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Location</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>

          <div className="h-[400px] w-full overflow-hidden rounded-lg border">
            <iframe
              title="Google Maps"
              src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>

          <Button asChild variant="outline" className="w-fit">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open in Google Maps
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
