import { randomOrderOptions } from "@/lib/random-order";

const preview = randomOrderOptions(0, 100);

export function BirthdayRandomOrdersDemo() {
  const idle = preview[0]?.label ?? "0";
  const motion = preview[6]?.label ?? "1";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[9rem] rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 transition duration-300 group-hover:border-zinc-900">
        <span className="relative block text-center font-sans text-[11px] tabular-nums text-zinc-800">
          <span className="block transition duration-300 group-hover:opacity-0">
            {idle}
          </span>
          <span className="absolute inset-0 block opacity-0 transition duration-300 group-hover:opacity-100">
            {motion}
          </span>
        </span>
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">10</p>
    </div>
  );
}
