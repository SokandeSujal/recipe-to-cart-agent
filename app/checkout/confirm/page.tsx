import { PageHeader } from "@/components/layout/page-header";

export default function CheckoutConfirmPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Confirm Instamart Order"
        description="A mandatory confirmation step will protect every real checkout call."
      />
      <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Checkout safety
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Instamart checkout is COD-only and orders cannot be cancelled once
          placed. The final checkout stage will enforce this with an explicit
          confirmation action before any Swiggy MCP order call.
        </p>
      </div>
    </section>
  );
}
