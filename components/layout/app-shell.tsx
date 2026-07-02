"use client";

import type { ReactNode } from "react";
import { CartPanel } from "@/components/cart/cart-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="mx-auto grid min-h-screen max-w-[1800px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_380px]">
        <Sidebar />
        <div className="flex min-w-0 flex-col border-x border-slate-200 bg-[#fbfaf8]">
          <Topbar />
          <main className="flex-1 px-4 py-5 sm:px-8 lg:px-10">{children}</main>
        </div>
        <aside className="hidden bg-[#fbfaf8] px-6 py-8 xl:block">
          <CartPanel />
        </aside>
      </div>
    </div>
  );
}
