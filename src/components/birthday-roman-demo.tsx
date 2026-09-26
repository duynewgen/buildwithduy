import { toRoman } from "@/lib/roman";
import { getTodayParts } from "@/lib/today";

export function BirthdayRomanDemo() {
  const { year } = getTodayParts();
  const label = toRoman(Number(year));

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 px-3">
      <div className="flex w-full max-w-[10rem] items-center justify-between gap-2 rounded-full border border-zinc-300 bg-white px-2.5 py-1 transition duration-300 ease-out group-hover:border-zinc-900">
        <span
          suppressHydrationWarning
          className="min-w-0 truncate font-sans text-[11px] tabular-nums tracking-wide text-zinc-800"
        >
          {label}
        </span>
        <span
          aria-hidden
          className="shrink-0 text-[8px] text-zinc-400 transition duration-300 group-hover:translate-y-px group-hover:text-zinc-700"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
