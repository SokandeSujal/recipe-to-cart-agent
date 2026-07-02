import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export default function RecipesPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="My Recipes"
        description="Saved extracted recipes will use localStorage in this demo build."
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Recipe library</h2>
        <p className="mt-2 text-sm text-slate-600">
          Stage 1 provides the route and layout. Recipe cards and persistence
          arrive in later stages.
        </p>
        <Link
          href="/recipes/demo-recipe"
          className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          View demo route
        </Link>
      </div>
    </section>
  );
}
