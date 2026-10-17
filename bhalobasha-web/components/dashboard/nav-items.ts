import {
  LayoutDashboard,
  Home,
  User,
  PlusCircle,
  Gavel,
  Heart,
  BellRing,
  CreditCard,
} from "lucide-react";

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
  {
    href: "/dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  { href: "/dashboard/favorites", label: "Saved", icon: Heart },
  {
    href: "/dashboard/saved-searches",
    label: "Search Alerts",
    icon: BellRing,
  },
];
