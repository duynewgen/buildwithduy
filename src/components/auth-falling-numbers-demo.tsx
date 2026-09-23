export function AuthFallingNumbersDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-50 px-3">
      <div className="absolute inset-x-0 top-0 flex h-full justify-around pt-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={[
              "font-sans text-sm tabular-nums text-zinc-700 opacity-0",
              "group-hover:animate-[number-fall_0.95s_ease-in_forwards]",
            ].join(" ")}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {i === 0 ? "7" : i === 1 ? "3" : "9"}
          </span>
        ))}
      </div>
      <div className="relative z-10 flex gap-1 transition duration-300 group-hover:opacity-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="size-3 rounded-sm border border-zinc-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}
