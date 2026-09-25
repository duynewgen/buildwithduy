import { toArabicDigits } from "@/lib/arabic";
import { getTodayParts } from "@/lib/today";

export function BirthdayArabicDemo() {
  const { year } = getTodayParts();
  const arabic = toArabicDigits(Number(year));

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 px-3">
      <div className="flex w-full max-w-[8.5rem] items-center justify-between rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 transition duration-300 group-hover:border-zinc-900">
        <span className="relative font-sans text-[11px] tabular-nums text-zinc-800">
          <span
            suppressHydrationWarning
            className="transition duration-300 group-hover:opacity-0"
          >
            {year}
          </span>
          <span
            suppressHydrationWarning
            className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          >
            {arabic}
          </span>
        </span>
        <span
          aria-hidden
          className="text-[8px] text-zinc-400 transition duration-300 group-hover:translate-y-px group-hover:text-zinc-700"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
