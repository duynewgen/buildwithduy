import { formulaFor } from "@/lib/math-formulas";
import { formatToday, getTodayParts } from "@/lib/today";

export function BirthdayMathDemo() {
  const { month, day, year } = getTodayParts();
  const formulas = [
    formulaFor(Number(month)),
    formulaFor(Number(day)),
    formulaFor(Number(year)),
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="flex w-full max-w-[10rem] flex-col gap-1.5">
        {formulas.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className={[
              "rounded-full border border-zinc-300 bg-white px-2.5 py-1",
              "transition duration-300 ease-out",
              "group-hover:border-zinc-900",
              index === 1 ? "delay-75" : index === 2 ? "delay-150" : "",
            ].join(" ")}
          >
            <span
              suppressHydrationWarning
              className={[
                "block truncate text-center font-sans text-[10px] tabular-nums tracking-wide text-zinc-700",
                "transition duration-300",
                "group-hover:animate-math-flip",
                index === 1 ? "delay-75" : index === 2 ? "delay-150" : "",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <p
        suppressHydrationWarning
        className="font-sans text-sm tabular-nums text-zinc-700"
      >
        {formatToday()}
      </p>
    </div>
  );
}
