/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationPickerProps {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
  centerLat?: number;
  centerLng?: number;
}

export function LocationPicker({
  lat,
  lng,
  onChange,
  centerLat = 23.8103,
  centerLng = 90.4125,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const latRef = useRef(lat);
  const lngRef = useRef(lng);
  const centerLatRef = useRef(centerLat);
  const centerLngRef = useRef(centerLng);
  const onChangeRef = useRef(onChange);
  const [mounted, setMounted] = useState(false);

  latRef.current = lat;
  lngRef.current = lng;
  centerLatRef.current = centerLat;
  centerLngRef.current = centerLng;
  onChangeRef.current = onChange;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Dynamically import leaflet — avoids SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const initialLat = latRef.current ?? centerLatRef.current;
      const initialLng = lngRef.current ?? centerLngRef.current;

      const map = L.map(mapRef.current!).setView([initialLat, initialLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const addMarker = (markerLat: number, markerLng: number) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([markerLat, markerLng]);
          return;
        }

        markerRef.current = L.marker([markerLat, markerLng], {
          draggable: true,
        }).addTo(map);
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current.getLatLng();
          onChangeRef.current(pos.lat, pos.lng);
        });
      };

      // Place initial marker if coords exist
      if (lat != null && lng != null) {
        addMarker(lat, lng);
      }

      // Click to place / move marker
      map.on("click", (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;

        addMarker(clickLat, clickLng);
        onChangeRef.current(clickLat, clickLng);
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mapInstanceRef.current || lat == null || lng == null) return;

    if (!markerRef.current) {
      import("leaflet").then((L) => {
        if (!mapInstanceRef.current || markerRef.current) return;
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
          mapInstanceRef.current,
        );
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current.getLatLng();
          onChangeRef.current(pos.lat, pos.lng);
        });
      });
    } else {
      markerRef.current.setLatLng([lat, lng]);
    }
    mapInstanceRef.current.setView([lat, lng], 15);
  }, [lat, lng]);

  // Re-center map when area changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([centerLat, centerLng], 15);
  }, [centerLat, centerLng]);

  if (!mounted) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            Click on the map or drag the pin to mark your property location
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((position) => {
              const nextLat = position.coords.latitude;
              const nextLng = position.coords.longitude;
              onChangeRef.current(nextLat, nextLng);
              mapInstanceRef.current?.setView([nextLat, nextLng], 16);
              if (markerRef.current) {
                markerRef.current.setLatLng([nextLat, nextLng]);
              } else if (mapInstanceRef.current) {
                import("leaflet").then((L) => {
                  if (markerRef.current || !mapInstanceRef.current) return;
                  markerRef.current = L.marker([nextLat, nextLng], {
                    draggable: true,
                  }).addTo(mapInstanceRef.current);
                  markerRef.current.on("dragend", () => {
                    const pos = markerRef.current.getLatLng();
                    onChangeRef.current(pos.lat, pos.lng);
                  });
                });
              }
            });
          }}
        >
          <LocateFixed className="h-4 w-4" />
          Use my location
        </Button>
      </div>
      <div
        ref={mapRef}
        className="h-64 w-full rounded-xl border overflow-hidden z-0"
      />
      {lat != null && lng != null && (
        <p className="text-xs text-muted">
          📍 {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
