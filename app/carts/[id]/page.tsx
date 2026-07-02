import { PageHeader } from "@/components/layout/page-header";

export default async function CartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Cart Detail"
        description={`Cart route ready for local demo item: ${id}`}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Cart review</h2>
        <p className="mt-2 text-sm text-slate-600">
          Item rows, bill totals, and checkout readiness will be built in the
          cart and checkout stages.
        </p>
      </div>
    </section>
  );
}
