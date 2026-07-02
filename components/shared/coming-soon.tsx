import { PageHeader } from "@/components/layout/page-header";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#fc4c02]">
          Coming soon
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          This route is intentionally stubbed for the current stage so the core
          recipe-to-cart flow stays focused.
        </p>
      </div>
    </section>
  );
}
