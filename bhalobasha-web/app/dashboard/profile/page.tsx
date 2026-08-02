"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "./_components/profile-form";
import { useProfile } from "@/lib/hooks/use-listings";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 w-28 rounded-full mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-muted">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted">Manage your account settings</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
