import { PageHeader } from "@/components/layout/page-header";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Home"
        title="Hey Sujal!"
        description="Turn any recipe into a smart shopping cart in seconds."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-950">
            Add your recipe from anywhere
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Stage 1 sets up the application shell. Recipe input tabs and mock
            visual data arrive in Stage 2.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">How it works</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {["Add recipe", "AI extracts", "Select servings", "Smart cart", "Order review"].map(
            (step, index) => (
              <div
                key={step}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fc4c02] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="mt-3 text-sm font-medium text-slate-900">
                  {step}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
