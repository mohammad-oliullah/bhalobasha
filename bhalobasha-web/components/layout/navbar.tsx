"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, LogIn, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth.store";
import { cn } from "@/lib/utils";
import { BhalobashaLogo } from "../common/bhalobasha-logo";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const isLoading = useAuthStore((state) => state.isLoading);

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <BhalobashaLogo />

        {/* Nav links — visible on all viewports; labels collapse to icon-only on mobile */}
        <nav className="flex items-center gap-1">
          <Link
            href="/listings"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary md:px-3",
              pathname === "/listings" && "bg-primary-light text-primary",
            )}
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Browse</span>
          </Link>

          {!isLoading && isAuthenticated && (
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary md:px-3",
                isDashboard && "bg-primary-light text-primary",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-20 rounded-lg" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm text-muted transition-colors hover:text-primary sm:block"
              >
                {user?.name || user?.phone || user?.email}
              </Link>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          )}

          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
