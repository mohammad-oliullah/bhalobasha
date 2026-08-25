/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

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

      const initialLat = lat ?? centerLat;
      const initialLng = lng ?? centerLng;

      const map = L.map(mapRef.current!).setView([initialLat, initialLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Place initial marker if coords exist
      if (lat && lng) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
          map,
        );
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current.getLatLng();
          onChange(pos.lat, pos.lng);
        });
      }

      // Click to place / move marker
      map.on("click", (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          markerRef.current = L.marker([clickLat, clickLng], {
            draggable: true,
          }).addTo(map);
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current.getLatLng();
            onChange(pos.lat, pos.lng);
          });
        }

        onChange(clickLat, clickLng);
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

  // Re-center map when area changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([centerLat, centerLng], 15);
  }, [centerLat, centerLng]);

  if (!mounted) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted">
        <MapPin className="h-4 w-4 text-primary" />
        <span>
          Click on the map or drag the pin to mark your property location
        </span>
      </div>
      <div
        ref={mapRef}
        className="h-64 w-full rounded-xl border overflow-hidden z-0"
      />
      {lat && lng && (
        <p className="text-xs text-muted">
          📍 {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
