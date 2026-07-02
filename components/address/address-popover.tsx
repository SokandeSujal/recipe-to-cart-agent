"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart, type DeliveryAddress } from "@/contexts/cart-context";

export function AddressPopover({ compact = false }: { compact?: boolean }) {
  const { selectedAddress, setSelectedAddress } = useCart();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch("/api/instamart/addresses", { cache: "no-store" })
      .then((response) => response.json())
      .then(
        (data: {
          addresses?: DeliveryAddress[];
          error?: string;
        }) => {
          if (!mounted) {
            return;
          }

          const nextAddresses = data.addresses ?? [];
          setAddresses(nextAddresses);
          setError(data.error ?? "");

          if (!selectedAddress && nextAddresses.length) {
            setSelectedAddress(nextAddresses[0]);
          }
        },
      )
      .catch((caught) => {
        if (mounted) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not load Instamart addresses.",
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedAddress, setSelectedAddress]);

  const label =
    selectedAddress?.addressTag ||
    selectedAddress?.addressCategory ||
    "Choose address";

  return (
    <div ref={popoverRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm transition hover:border-orange-200 hover:text-[#fc4c02]",
          compact ? "px-3 py-2" : "h-11 px-3",
        ].join(" ")}
      >
        <MapPin size={18} strokeWidth={1.9} />
        <span className={compact ? "max-w-28 truncate" : "hidden max-w-32 truncate xl:block"}>
          {label}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-30 w-[min(340px,calc(100vw-24px))] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="px-2 py-2">
            <p className="text-sm font-bold text-slate-950">
              Delivery address
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Read-only saved Instamart addresses.
            </p>
          </div>

          {loading ? (
            <p className="px-2 py-3 text-sm font-medium text-slate-500">
              Loading addresses...
            </p>
          ) : null}
          {error ? (
            <p className="m-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              {error}
            </p>
          ) : null}

          <div className="max-h-80 overflow-y-auto">
            {addresses.map((address) => {
              const selected = selectedAddress?.id === address.id;
              const addressLabel =
                address.addressTag || address.addressCategory || "Address";

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => {
                    setSelectedAddress(address);
                    setOpen(false);
                  }}
                  className={[
                    "w-full rounded-lg border p-3 text-left transition",
                    selected
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-950">
                      {addressLabel}
                    </span>
                    {selected ? (
                      <span className="rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                    {address.addressLine}
                  </p>
                  {address.phoneNumber ? (
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      Phone {address.phoneNumber}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
