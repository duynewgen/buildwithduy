export function AuthSnakeDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-50 px-3">
      <div className="relative h-16 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
        <div className="absolute left-2 top-7 flex transition duration-700 group-hover:translate-x-8">
          <div className="size-2.5 rounded-full bg-zinc-900" />
          <div className="ml-0.5 size-2.5 rounded-full bg-zinc-700" />
          <div className="ml-0.5 size-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="absolute right-3 top-6 flex size-4 items-center justify-center rounded-full bg-emerald-500 transition duration-700 group-hover:scale-0 group-hover:opacity-0">
          <span className="font-sans text-[7px] tabular-nums text-white">4</span>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-sans text-[8px] tabular-nums text-zinc-500 opacity-0 transition duration-500 group-hover:opacity-100">
          4·····
        </div>
      </div>
    </div>
  );
}
