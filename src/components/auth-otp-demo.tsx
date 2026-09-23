export function AuthOtpDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-50 px-3">
      <div className="flex gap-1 transition duration-300 group-hover:opacity-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="size-3 rounded-sm border border-zinc-200 bg-white"
          />
        ))}
      </div>
      <p className="pointer-events-none absolute font-sans text-sm tabular-nums tracking-[0.2em] text-zinc-800 opacity-0 transition duration-500 group-hover:opacity-100">
        ******
      </p>
    </div>
  );
}
