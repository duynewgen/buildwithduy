import { getTodayParts } from "@/lib/today";

export function BirthdayClickDemo() {
  const { year } = getTodayParts();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="relative flex h-16 w-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-300 bg-white transition group-hover:border-zinc-900">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:animate-click-flash"
        />
        <span
          aria-hidden
          className="font-sans text-2xl tabular-nums text-zinc-400 after:content-['0'] group-hover:text-zinc-900 group-hover:after:animate-click-mash"
        />
      </div>
      <p
        suppressHydrationWarning
        className="font-sans text-sm tabular-nums text-zinc-700"
      >
        {year}
      </p>
    </div>
  );
}
