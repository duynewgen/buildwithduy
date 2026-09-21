import { getTodayParts } from "@/lib/today";

export function BirthdayBounceDemo() {
  const { month, day } = getTodayParts();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f7f4ef] px-3">
      <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-zinc-200 bg-[#faf7f2]">
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[#d6c7a8]" />
        <div className="absolute bottom-2 left-1/2 h-2 w-6 -translate-x-1/2 rounded-sm bg-[#8a7a5c]" />
        <span
          aria-hidden
          className="absolute bottom-4 left-1/2 text-base group-hover:animate-bounce-cake"
        >
          🎂
        </span>
      </div>
      <p
        suppressHydrationWarning
        className="font-sans text-sm tabular-nums text-zinc-700"
      >
        {month} / {day}
      </p>
    </div>
  );
}
