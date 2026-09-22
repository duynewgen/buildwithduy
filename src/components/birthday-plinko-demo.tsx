import { formatToday } from "@/lib/today";

export function BirthdayPlinkoDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f7f4ef] px-3">
      <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-zinc-200 bg-[#faf7f2]">
        {/* pegs */}
        <span
          aria-hidden
          className="absolute left-4 top-5 size-1.5 rounded-full bg-[#5b3a1a]"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-4 size-1.5 -translate-x-1/2 rounded-full bg-[#5b3a1a]"
        />
        <span
          aria-hidden
          className="absolute right-4 top-5 size-1.5 rounded-full bg-[#5b3a1a]"
        />
        <span
          aria-hidden
          className="absolute left-7 top-8 size-1.5 rounded-full bg-[#5b3a1a]"
        />
        <span
          aria-hidden
          className="absolute right-7 top-8 size-1.5 rounded-full bg-[#5b3a1a]"
        />
        {/* slots */}
        <div className="absolute inset-x-1 bottom-0 flex h-3 overflow-hidden rounded-b-[10px]">
          <span className="flex-1 bg-[#efe6d6]" />
          <span className="flex-1 bg-[#fde68a]" />
          <span className="flex-1 bg-[#e7dcc8]" />
          <span className="flex-1 bg-[#efe6d6]" />
        </div>
        <span
          aria-hidden
          className="absolute left-1/2 top-1 -translate-x-1/2 text-sm group-hover:animate-plinko-drop group-hover:translate-x-0"
        >
          🎂
        </span>
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
