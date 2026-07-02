import { Bell, Database } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between border-b border-slate-200 bg-[#fbfaf8]/95 px-4 backdrop-blur sm:px-8 lg:px-10">
      <div className="lg:hidden">
        <p className="text-lg font-bold text-slate-950">RecipeCart</p>
        <p className="text-xs text-slate-500">AI Recipe to Instamart Cart</p>
      </div>
      <div className="hidden lg:block">
        <p className="text-sm font-medium text-slate-500">RecipeCart demo</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm sm:flex">
          <Database size={19} strokeWidth={1.8} />
          API Usage: 120 credits
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-800 hover:bg-white"
        >
          <Bell size={22} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#58328f] text-sm font-semibold text-white">
            S
          </span>
          <span className="hidden text-sm font-medium text-slate-900 sm:block">
            Sujal Sokande
          </span>
        </button>
      </div>
    </header>
  );
}
