"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, LogIn, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            ভা
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-bold text-primary">Bhalobasha</span>
            <span className="block text-xs text-muted">ভালোবাসা</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/listings"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary",
              pathname === "/listings" && "bg-primary-light text-primary",
            )}
          >
            <Search className="h-4 w-4" />
            Browse
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary",
                isDashboard && "bg-primary-light text-primary",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted sm:block">
                {user?.name || user?.phone}
              </span>
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
