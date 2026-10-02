import { toRoman } from "@/lib/roman";

export function BirthdayRomanDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="flex w-full max-w-[10rem] items-center justify-between gap-2 rounded-full border border-zinc-300 bg-white px-2.5 py-1 transition duration-300 ease-out group-hover:border-zinc-900">
        <span className="relative min-w-0 flex-1 font-sans text-[11px] tabular-nums tracking-wide text-zinc-800">
          <span className="block truncate transition duration-300 group-hover:opacity-0">
            {toRoman(10)}
          </span>
          <span className="absolute inset-0 block truncate opacity-0 transition duration-300 group-hover:opacity-100">
            {toRoman(42)}
          </span>
        </span>
        <span
          aria-hidden
          className="shrink-0 text-[8px] text-zinc-400 transition duration-300 group-hover:translate-y-px group-hover:text-zinc-700"
        >
          ▾
        </span>
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">10</p>
    </div>
  );
}
