"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  ClipboardList,
  Heart,
  Home,
  MessageSquare,
  ReceiptText,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Video,
} from "lucide-react";

const primaryNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/recipes", label: "My Recipes", icon: ReceiptText },
  { href: "/carts", label: "My Carts", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/price-tracker", label: "Price Tracker", icon: TrendingUp },
  { href: "/youtube-library", label: "YouTube Library", icon: Video },
];

const secondaryNav = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: CircleHelp },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#fc4c02] text-[#fc4c02]">
          <ShoppingBag size={24} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-xl font-bold leading-tight text-slate-950">
            RecipeCart
          </span>
          <span className="text-sm text-slate-600">
            AI Recipe to Instamart Cart
          </span>
        </span>
      </Link>

      <nav className="mt-10 space-y-1">
        {primaryNav.map((item) => (
          <SidebarNavItem key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-5">
        <nav className="space-y-1">
          {secondaryNav.map((item) => (
            <SidebarNavItem key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>
      </div>

      <div className="mt-auto rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">
            Swiggy Builders Club
          </p>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-orange-700">
            MCP Powered
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-600">
          Connect, build, ship with Swiggy MCP servers for Food, Instamart,
          and Dineout.
        </p>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  item,
  active,
}: {
  item: (typeof primaryNav)[number];
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={[
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
        active
          ? "bg-orange-50 text-[#fc4c02]"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
      ].join(" ")}
    >
      <Icon size={21} strokeWidth={1.9} />
      {item.label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
