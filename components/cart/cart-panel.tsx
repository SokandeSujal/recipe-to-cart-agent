import { ShieldCheck, ShoppingCart } from "lucide-react";

export function CartPanel() {
  return (
    <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <ShoppingCart size={24} strokeWidth={1.8} />
          <h2 className="text-lg font-semibold text-slate-950">Your Cart</h2>
        </div>
        <span className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          0 Items
        </span>
      </div>

      <div className="py-12 text-center">
        <p className="text-sm font-medium text-slate-900">Cart setup ready</p>
        <p className="mx-auto mt-2 max-w-56 text-sm leading-6 text-slate-500">
          Mock cart rows and totals will be added during the static UI stage.
        </p>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <button
          type="button"
          disabled
          className="w-full rounded-xl bg-[#fc4c02]/50 px-4 py-4 text-sm font-semibold text-white"
        >
          Proceed to Instamart
        </button>
        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
          <ShieldCheck
            className="mt-0.5 shrink-0 text-emerald-600"
            size={16}
            strokeWidth={1.9}
          />
          <p>COD-only checkout requires confirmation. Orders cannot be cancelled once placed.</p>
        </div>
      </div>
    </div>
  );
}
