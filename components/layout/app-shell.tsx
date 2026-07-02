"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, Home, ReceiptText, ShoppingCart } from "lucide-react";
import { CartPanel } from "@/components/cart/cart-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CartProvider } from "@/contexts/cart-context";

const mobileNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/recipes", label: "Recipes", icon: ReceiptText },
  { href: "/carts", label: "Carts", icon: ShoppingCart },
  { href: "/checkout/confirm", label: "Checkout", icon: ClipboardCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#fbfaf8]">
        <div className="mx-auto grid min-h-screen max-w-[1900px] grid-cols-1 lg:grid-cols-[282px_minmax(0,1fr)] 2xl:grid-cols-[282px_minmax(0,1fr)_420px]">
          <Sidebar />
          <div className="flex min-w-0 flex-col border-slate-200 bg-[#fbfaf8] lg:border-x">
            <Topbar />
            <MobileNav />
            <main className="flex-1 px-3 py-4 sm:px-6 lg:px-8 xl:px-9">
              {children}
              <div className="mt-5 2xl:hidden">
                <CartPanel />
              </div>
            </main>
          </div>
          <aside className="hidden bg-[#fbfaf8] px-6 py-8 2xl:block">
            <CartPanel />
          </aside>
        </div>
      </div>
    </CartProvider>
  );
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-y border-slate-200 bg-white px-3 py-2 lg:hidden">
      {mobileNav.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
              active
                ? "bg-orange-50 text-[#fc4c02]"
                : "text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            <Icon size={17} strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
