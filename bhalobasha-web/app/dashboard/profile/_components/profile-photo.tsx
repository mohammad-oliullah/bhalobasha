"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Upload, User } from "lucide-react";
import { uploadImage } from "@/lib/api/media";

interface ProfilePhotoProps {
  photoUrl: string | null;
  onUpload: (url: string) => void;
}

export function ProfilePhoto({ photoUrl, onUpload }: ProfilePhotoProps) {
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUpload(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-primary-light">
        {photoUrl ? (
          <Image src={photoUrl} alt="Profile" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="h-12 w-12 text-primary" />
          </div>
        )}
      </div>
      <label className="cursor-pointer">
        <span className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Change Photo"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={uploading}
          onChange={handlePhotoUpload}
        />
      </label>
    </div>
  );
}
