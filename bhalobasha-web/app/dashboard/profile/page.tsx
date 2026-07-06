"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import { useProfile, useUpdateProfile } from "@/lib/hooks/use-listings";
import { uploadImage } from "@/lib/api/media";
import { formatPhone } from "@/lib/utils/format";
import { UserRole } from "@/types";
import { Upload, User } from "lucide-react";

export default function ProfilePage() {
  const { setUser } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setProfilePhoto(profile.profilePhoto);
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setProfilePhoto(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfile.mutateAsync({
        name: name || undefined,
        email: email || undefined,
        profilePhoto: profilePhoto || undefined,
      });
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted">Manage your account settings</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-primary-light">
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              alt="Profile"
              fill
              className="object-cover"
            />
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
        {profile && (
          <Badge variant="secondary">
            {profile.role === UserRole.OWNER ? "OWNER" : profile.role === UserRole.ADMIN ? "ADMIN" : "SEEKER"}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Phone (read only)</Label>
          <Input
            value={profile ? formatPhone(profile.phone) : ""}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
