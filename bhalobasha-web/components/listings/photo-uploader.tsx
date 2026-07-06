"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/api/media";
import { cn } from "@/lib/utils";

interface PhotoItem {
  url: string;
  id: string;
}

interface PhotoUploaderProps {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
}

export function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 8,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxPhotos - photos.length;

      if (remaining <= 0) {
        toast.error("Maximum 8 photos allowed");
        return;
      }

      const toUpload = fileArray.slice(0, remaining);
      const valid = toUpload.filter((f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      );

      if (valid.length !== toUpload.length) {
        toast.error("Only JPEG, PNG, and WebP images are allowed");
      }

      if (valid.length === 0) return;

      setUploading(true);
      try {
        const uploaded: PhotoItem[] = [];
        for (const file of valid) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} exceeds 5MB limit`);
            continue;
          }
          const url = await uploadImage(file);
          uploaded.push({ url, id: crypto.randomUUID() });
        }
        onChange([...photos, ...uploaded]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [photos, onChange, maxPhotos],
  );

  const removePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  const movePhoto = (from: number, to: number) => {
    const updated = [...photos];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          dragOver ? "border-primary bg-primary-light" : "border-gray-200",
          uploading && "opacity-50 pointer-events-none",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="mb-3 h-10 w-10 text-muted" />
        <p className="font-medium">Drag & drop photos here</p>
        <p className="mt-1 text-sm text-muted">
          or click to browse (max {maxPhotos}, JPEG/PNG/WebP, 5MB each)
        </p>
        <label className="mt-4 cursor-pointer">
          <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            {uploading ? "Uploading..." : "Choose Files"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading || photos.length >= maxPhotos}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border"
            >
              <Image
                src={photo.url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-xs text-white">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => movePhoto(index, index - 1)}
                    className="rounded bg-black/50 p-1 text-white"
                  >
                    <GripVertical className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted">
        {photos.length}/{maxPhotos} photos · First photo will be set as primary
      </p>
    </div>
  );
}
