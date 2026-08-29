"use client";

import Image from "next/image";
import { useState } from "react";
import { ListingPhoto } from "@/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Home } from "lucide-react";

interface ListingPhotosProps {
  photos: ListingPhoto[];
  title: string;
}

export function ListingPhotos({ photos, title }: ListingPhotosProps) {
  const sorted = [...photos].sort(
    (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = sorted[activeIndex];

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/7] max-h-[420px] items-center justify-center rounded-xl bg-muted/20">
        <Home className="h-16 w-16 text-muted opacity-30" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          className="relative aspect-[16/7] w-full max-h-[420px] overflow-hidden rounded-xl bg-muted/20"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={active.url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 70vw"
            priority
          />
        </button>
        {sorted.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sorted.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2",
                  i === activeIndex ? "border-primary" : "border-transparent",
                )}
              >
                <Image
                  src={photo.url}
                  alt={`${title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black/95 p-2">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={active.url}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
