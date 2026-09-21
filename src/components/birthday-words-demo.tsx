import {
  dayToWords,
  monthToWords,
  yearToWords,
} from "@/lib/number-words";
import { getTodayParts } from "@/lib/today";

function todayWords() {
  const { month, day, year } = getTodayParts();
  return {
    month: monthToWords(Number(month)),
    day: dayToWords(Number(day)),
    year: yearToWords(Number(year)),
  };
}

export function BirthdayWordsDemo() {
  const words = todayWords();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="flex w-full max-w-[10rem] flex-col gap-1.5">
        {[words.month, words.day, words.year].map((label, index) => (
          <div
            key={label}
            className={[
              "flex items-center justify-between gap-2 rounded-full border border-zinc-300 bg-white px-2.5 py-1",
              "transition duration-300 ease-out",
              index === 0
                ? "group-hover:border-zinc-900"
                : index === 1
                  ? "delay-75 group-hover:border-zinc-900"
                  : "delay-150 group-hover:border-zinc-900",
            ].join(" ")}
          >
            <span
              suppressHydrationWarning
              className="min-w-0 truncate font-sans text-[10px] leading-tight text-zinc-800"
            >
              {label}
            </span>
            <span
              aria-hidden
              className={[
                "text-[8px] text-zinc-400 transition duration-300",
                "group-hover:translate-y-px group-hover:text-zinc-700",
                index === 1 ? "delay-75" : index === 2 ? "delay-150" : "",
              ].join(" ")}
            >
              ▾
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
