"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMyFavoriteIds, useToggleFavorite } from "@/lib/hooks/use-favorites";
import { useAuthStore } from "@/lib/store/auth.store";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export function FavoriteButton({ listingId, className }: FavoriteButtonProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: favoriteIds = [] } = useMyFavoriteIds();
  const isFavorited = favoriteIds.includes(listingId);
  const { mutate: toggle, isPending } = useToggleFavorite(listingId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // prevent card navigation
    e.stopPropagation();

    if (!isAuthenticated) {
      toast("Login to save listings", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    toggle(isFavorited, {
      onSuccess: () =>
        toast.success(
          isFavorited ? "Removed from favorites" : "Saved to favorites",
        ),
      onError: () => toast.error("Failed to update favorites"),
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110 disabled:opacity-50",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorited
            ? "fill-red-500 text-red-500"
            : "fill-none text-muted-foreground",
        )}
      />
    </button>
  );
}
