"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map } from "leaflet";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ListingMapPreviewProps {
  latitude: number;
  longitude: number;
  title: string;
  trigger?: "icon" | "button";
}

export function ListingMapPreview({
  latitude,
  longitude,
  title,
  trigger = "button",
}: ListingMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || !mapRef.current) return;

    const el = mapRef.current;
    let cancelled = false;
    let timeoutId: number | null = null;
    let rafId: number | null = null;

    const invalidateMap = () => {
      if (!mapInstanceRef.current) return;
      mapInstanceRef.current.invalidateSize();
    };

    const initializeMap = () => {
      import("leaflet")
        .then((L) => {
          if (cancelled || !el.isConnected) return;

          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }

          const map = L.map(el).setView([latitude, longitude], 15);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(map);
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(title)
            .openPopup();
          mapInstanceRef.current = map;

          requestAnimationFrame(invalidateMap);
          timeoutId = window.setTimeout(() => {
            invalidateMap();
            window.setTimeout(invalidateMap, 250);
          }, 150);
        })
        .catch((err) => {
          console.error("Leaflet init failed:", err);
        });
    };

    rafId = requestAnimationFrame(initializeMap);

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(invalidateMap);
    });
    ro.observe(el);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) window.clearTimeout(timeoutId);
      ro.disconnect();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [open, latitude, longitude, title]);

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
          <div
            ref={mapRef}
            className="leaflet-container h-[min(60vh,28rem)] min-h-[280px] w-full rounded-lg border overflow-hidden"
          />
          <Button asChild variant="outline" className="w-fit">
            <a href={googleMapsUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open in Google Maps
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
