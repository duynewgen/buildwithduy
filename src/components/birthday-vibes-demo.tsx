import { vibeFor } from "@/lib/age-vibes";

export function BirthdayVibesDemo() {
  const idleAge = 12;
  const motionAge = 36;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[9rem] rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 transition duration-300 group-hover:border-zinc-900">
        <span className="relative block h-8 text-center font-sans text-[11px] leading-tight text-zinc-800">
          <span className="absolute inset-0 flex items-center justify-center transition duration-300 group-hover:opacity-0">
            <span className="line-clamp-2">{vibeFor(idleAge)}</span>
          </span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="line-clamp-2">{vibeFor(motionAge)}</span>
          </span>
        </span>
      </div>
      <p className="relative h-5 w-full text-center font-sans text-sm tabular-nums text-zinc-700">
        <span className="absolute inset-0 transition duration-300 group-hover:opacity-0">
          {idleAge}
        </span>
        <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
          {motionAge}
        </span>
      </p>
    </div>
  );
}
