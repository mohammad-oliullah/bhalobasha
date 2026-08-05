import { LayoutDashboard, Home, User, PlusCircle, Gavel } from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/listings",
    label: "My Listings",
    icon: Home,
  },
  {
    href: "/dashboard/listings/new",
    label: "Post New",
    icon: PlusCircle,
  },
  {
    href: "/dashboard/bids",
    label: "My Bids",
    icon: Gavel,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
];
