export function BirthdayMorseDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-50 px-3">
      <div className="relative flex h-10 w-full max-w-[7rem] items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-[10px] text-zinc-500 transition duration-300 group-hover:border-amber-400 group-hover:bg-amber-200 group-hover:text-zinc-900">
        <span className="opacity-100 group-hover:opacity-0">tap</span>
        <span className="absolute opacity-0 group-hover:opacity-100">hold</span>
      </div>
      <p className="font-sans text-[11px] tracking-[0.25em] text-zinc-700">
        <span className="group-hover:hidden">·</span>
        <span className="hidden group-hover:inline">−</span>
      </p>
    </div>
  );
}
