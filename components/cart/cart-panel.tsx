"use client";

import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AddressPopover } from "@/components/address/address-popover";
import { MockModeBanner } from "@/components/shared/mock-mode-banner";
import { getCartItemKey, useCart } from "@/contexts/cart-context";

export function CartPanel() {
  const { cart, selectedAddress, removeCartItem } = useCart();
  const itemCount =
    cart?.items.reduce(
      (total, item) =>
        item.matchStatus === "needs_review" ? total : total + item.quantity,
      0,
    ) ?? 0;

  return (
    <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <ShoppingCart size={25} strokeWidth={1.8} />
          <h2 className="text-lg font-semibold text-slate-950">Your Cart</h2>
        </div>
        <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
          {itemCount} Items
        </span>
      </div>

      {cart?.mode === "mock" ? (
        <div className="mt-4">
          <MockModeBanner compact />
        </div>
      ) : null}

      {!cart ? (
        <div className="py-12 text-center">
          <p className="text-sm font-bold text-slate-950">No cart yet</p>
          <p className="mx-auto mt-2 max-w-56 text-sm leading-6 text-slate-500">
            Extract a recipe to generate a live Instamart cart here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 py-5">
            {cart.items.map((item) => (
              <div
                key={getCartItemKey(item)}
                className="grid grid-cols-[58px_1fr_auto] gap-3"
              >
                <div className="h-14 w-14 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                  {item.product.image ? (
                    <div
                      aria-hidden="true"
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.product.image})` }}
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5 text-slate-950">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {item.matchStatus === "needs_review"
                      ? item.matchReason || "No confident match."
                      : `${item.quantity} x ${item.product.displaySize}`}
                  </p>
                  {item.matchStatus === "needs_review" ? (
                    <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
                      Needs review
                    </span>
                  ) : null}
                </div>
                <div className="min-w-[76px] text-right">
                  <div className="flex items-start justify-end gap-2">
                    <p className="text-sm font-bold text-slate-950">
                      Rs {item.product.price * item.quantity}
                    </p>
                    <button
                      type="button"
                      aria-label={`Remove ${item.ingredient.name}`}
                      onClick={() => removeCartItem(getCartItemKey(item))}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} strokeWidth={1.9} />
                    </button>
                  </div>
                  {item.matchStatus !== "needs_review" ? (
                    <p className="mt-2 rounded-lg border border-slate-200 px-2 py-1 text-center text-xs font-semibold text-slate-700">
                      Qty {item.quantity}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {selectedAddress ? (
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <MapPin size={15} strokeWidth={1.9} />
                    Delivering to{" "}
                    {selectedAddress.addressTag ||
                      selectedAddress.addressCategory ||
                      "selected address"}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-emerald-900">
                    {selectedAddress.addressLine}
                  </p>
                </div>
                <AddressPopover compact />
              </div>
            </div>
          ) : null}

          <div className="border-t border-dashed border-slate-300 pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Item Total</span>
                <span className="font-semibold text-slate-950">
                  Rs {cart.itemTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-semibold text-emerald-600">
                  {cart.deliveryFee === 0 ? "FREE" : `Rs ${cart.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Handling Fee</span>
                <span className="font-semibold text-slate-950">
                  Rs {cart.handlingFee}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-base font-semibold text-slate-950">
                  To Pay
                </span>
                <span className="text-2xl font-bold text-slate-950">
                  Rs {cart.total}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#fc4c02]/50 px-4 py-4 text-sm font-semibold text-white"
            >
              Proceed to Instamart
              <ArrowRight size={18} strokeWidth={2} />
            </button>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-emerald-600"
                size={16}
                strokeWidth={1.9}
              />
              <p>
                Order placement is disabled during testing. No checkout call is
                reachable.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
