import { getTodayParts } from "@/lib/today";

export function BirthdayLotteryDemo() {
  const { year } = getTodayParts();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="flex items-stretch">
        <div className="flex h-11 w-14 items-center justify-center rounded-l-md border border-zinc-300 bg-[#f3eee6]">
          <span
            suppressHydrationWarning
            className="font-sans text-[11px] tabular-nums text-zinc-900 transition duration-500 group-hover:blur-[1px]"
          >
            {year}
          </span>
        </div>
        <div className="relative flex h-11 w-4 items-end justify-center rounded-r-md border border-l-0 border-zinc-300 bg-zinc-200 pb-1">
          <span className="absolute bottom-2 left-1/2 flex origin-bottom -translate-x-1/2 flex-col items-center transition duration-500 ease-out group-hover:rotate-[70deg]">
            <span className="mb-px h-2 w-2 rounded-full bg-red-600" />
            <span className="h-5 w-0.5 rounded-full bg-zinc-500" />
          </span>
        </div>
      </div>
    </div>
  );
}
