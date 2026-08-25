"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfilePhoto } from "./profile-photo";
import { useUpdateProfile } from "@/lib/hooks/use-listings";
import { useAuth } from "@/lib/hooks/use-auth";
import { User, UserRole } from "@/types";

interface ProfileFormProps {
  profile: User;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { setUser } = useAuth();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(profile.name ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    profile.profilePhoto,
  );

  // Sync if profile changes
  useEffect(() => {
    setName(profile.name ?? "");
    setEmail(profile.email ?? "");
    setPhone(profile.phone ?? "");
    setProfilePhoto(profile.profilePhoto);
  }, [profile]);

  // A field is locked if the user already has a value for it
  const phoneExists = !!profile.phone;
  const emailExists = !!profile.email;

  const roleBadgeLabel =
    profile.role === UserRole.OWNER
      ? "Owner"
      : profile.role === UserRole.ADMIN
        ? "Admin"
        : "Seeker";

  const handleSave = async () => {
    try {
      const payload: Record<string, string> = {};

      // Only send name if changed
      if (name !== (profile.name ?? "")) {
        payload.name = name;
      }

      // Only send phone if it was missing and user filled it in
      if (!phoneExists && phone && phone !== (profile.phone ?? "")) {
        payload.phone = phone;
      }

      // Only send email if it was missing and user filled it in
      if (!emailExists && email && email !== (profile.email ?? "")) {
        payload.email = email;
      }

      // Only send profilePhoto if changed
      if (profilePhoto !== profile.profilePhoto) {
        payload.profilePhoto = profilePhoto ?? "";
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const updated = await updateProfile.mutateAsync(payload);
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <div className="space-y-8">
      <ProfilePhoto
        photoUrl={profilePhoto}
        onUpload={(url) => setProfilePhoto(url)}
      />

      <div className="flex justify-center">
        <Badge variant="secondary">{roleBadgeLabel}</Badge>
      </div>

      <div className="space-y-4">
        {/* Phone */}
        <div className="space-y-2">
          <Label>
            Phone Number
            {phoneExists && (
              <span className="ml-2 text-xs text-muted">
                (cannot be changed)
              </span>
            )}
          </Label>
          {phoneExists ? (
            <Input
              value={profile.phone ?? ""} // ← raw value, not formatPhone()
              disabled
              className="bg-surface-muted"
            />
          ) : (
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
            />
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>
            Email Address
            {emailExists && (
              <span className="ml-2 text-xs text-muted">
                (cannot be changed)
              </span>
            )}
          </Label>
          {emailExists ? (
            <Input
              value={profile.email ?? ""}
              disabled
              className="bg-surface-muted"
            />
          ) : (
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          )}
        </div>

        {/* Name — always editable */}
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
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
