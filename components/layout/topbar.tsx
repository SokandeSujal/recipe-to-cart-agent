"use client";

import { Bell, CheckCircle, ChevronDown, LogOut, RefreshCw, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AddressPopover } from "@/components/address/address-popover";

type SessionStatus = {
  mode: "real" | "mock";
  authorized: boolean;
  user: {
    label: string;
    initials: string;
  } | null;
};

export function Topbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SessionStatus>({
    mode: "mock",
    authorized: false,
    user: null,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  async function refreshSession() {
    const response = await fetch("/api/mcp/status", { cache: "no-store" });
    const nextSession = (await response.json()) as SessionStatus;
    setSession(nextSession);
  }

  useEffect(() => {
    let mounted = true;

    fetch("/api/mcp/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((nextSession: SessionStatus) => {
        if (mounted) {
          setSession(nextSession);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  async function logOut() {
    await fetch("/api/mcp/logout", { method: "POST" });
    setOpen(false);
    await refreshSession();
  }

  const connected = session.authorized && session.mode === "real";
  const label = session.user?.label || "Guest";
  const initials = session.user?.initials || "G";

  return (
    <header className="sticky top-0 z-10 flex min-h-[92px] items-center justify-between bg-[#fbfaf8]/95 px-4 backdrop-blur sm:px-8 lg:px-9">
      <div className="lg:hidden">
        <p className="text-lg font-bold text-slate-950">RecipeCart</p>
        <p className="text-xs text-slate-500">AI Recipe to Instamart Cart</p>
      </div>
      <div className="hidden lg:block">
        <p className="text-sm font-medium text-slate-500">
          Smart recipe shopping
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={[
            "hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold sm:flex",
            connected
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800",
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              connected ? "bg-emerald-500" : "bg-amber-500",
            ].join(" ")}
          />
          {connected ? "Connected to Swiggy" : "Not connected"}
        </div>

        <AddressPopover />

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-800 hover:bg-white"
        >
          <Bell size={22} strokeWidth={1.8} />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-white"
          >
            <span
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white",
                connected ? "bg-emerald-600" : "bg-slate-500",
              ].join(" ")}
            >
              {initials}
            </span>
            <span className="hidden max-w-44 truncate text-sm font-medium text-slate-900 sm:block">
              {label}
            </span>
            <ChevronDown
              className="hidden text-slate-700 sm:block"
              size={17}
              strokeWidth={1.9}
            />
          </button>

          {open ? (
            <div className="absolute right-0 top-14 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  {connected ? (
                    <CheckCircle className="text-emerald-600" size={17} strokeWidth={1.9} />
                  ) : (
                    <User className="text-slate-500" size={17} strokeWidth={1.9} />
                  )}
                  {connected ? "Connected to Swiggy" : "Not connected"}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {connected
                    ? `Signed in as ${label}`
                    : "Connect Swiggy to search live MCP data."}
                </p>
              </div>

              {!connected ? (
                <Link
                  href="/api/mcp/auth/instamart"
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <RefreshCw size={16} strokeWidth={1.9} />
                  Reconnect Swiggy
                </Link>
              ) : null}

              <button
                type="button"
                onClick={logOut}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <LogOut size={16} strokeWidth={1.9} />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
