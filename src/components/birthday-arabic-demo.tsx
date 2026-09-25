import { toArabicWords } from "@/lib/arabic";
import { getTodayParts } from "@/lib/today";

export function BirthdayArabicDemo() {
  const { year } = getTodayParts();
  const arabic = toArabicWords(Number(year));

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 px-3">
      <div className="flex w-full max-w-[9rem] items-center justify-between gap-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 transition duration-300 group-hover:border-zinc-900">
        <span className="relative min-w-0 flex-1 font-sans text-[10px] leading-tight text-zinc-800">
          <span
            suppressHydrationWarning
            className="block truncate transition duration-300 group-hover:opacity-0"
          >
            {year}
          </span>
          <span
            suppressHydrationWarning
            dir="rtl"
            className="absolute inset-0 block truncate text-right opacity-0 transition duration-300 group-hover:opacity-100"
          >
            {arabic}
          </span>
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
