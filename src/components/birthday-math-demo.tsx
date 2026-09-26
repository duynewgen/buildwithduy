import { advancedFormulaFor } from "@/lib/math-formulas";
import { getTodayParts } from "@/lib/today";

export function BirthdayMathDemo() {
  const { year } = getTodayParts();
  const formula = advancedFormulaFor(Number(year));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[10rem] rounded-full border border-zinc-300 bg-white px-2.5 py-1 transition duration-300 ease-out group-hover:border-zinc-900">
        <span
          suppressHydrationWarning
          className="block truncate text-center font-sans text-[10px] tabular-nums tracking-wide text-zinc-700 transition duration-300 group-hover:animate-math-flip"
        >
          {formula}
        </span>
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
