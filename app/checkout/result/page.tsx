import { PageHeader } from "@/components/layout/page-header";

export default function CheckoutResultPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Checkout Result"
        description="Order success and failure states will appear here after checkout."
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Result state</h2>
        <p className="mt-2 text-sm text-slate-600">
          This route is ready for mocked and real checkout responses.
        </p>
      </div>
    </section>
  );
}
