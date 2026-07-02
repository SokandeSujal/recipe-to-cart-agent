export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#fc4c02]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
