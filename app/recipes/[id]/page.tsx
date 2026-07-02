import { PageHeader } from "@/components/layout/page-header";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Recipe Detail"
        description={`Recipe route ready for local demo item: ${id}`}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Extraction review
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Ingredient review, serving controls, and Instamart matching will be
          built in the planned extraction and cart stages.
        </p>
      </div>
    </section>
  );
}
