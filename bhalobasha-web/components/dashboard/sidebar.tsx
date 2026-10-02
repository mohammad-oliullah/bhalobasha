"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { UserRole } from "@/types";
import { navItems } from "./nav-items";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const items =
    user?.role === UserRole.ADMIN
      ? [
          ...navItems,
          {
            href: "/dashboard/admin/moderation",
            label: "Moderation",
            icon: ShieldCheck,
          },
        ]
      : navItems;

  return (
    <aside className="lg:w-56">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-primary-light hover:text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
