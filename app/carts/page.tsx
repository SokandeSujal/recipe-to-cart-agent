import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export default function CartsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="My Carts"
        description="Generated carts will be saved locally for this demo."
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Cart history</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cart persistence and generated cart summaries are scheduled for the
          cart stages.
        </p>
        <Link
          href="/carts/demo-cart"
          className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          View demo route
        </Link>
      </div>
    </section>
  );
}
