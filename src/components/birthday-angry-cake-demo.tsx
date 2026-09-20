function formatToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = String(now.getFullYear()).padStart(4, "0");
  return `${month} / ${day} / ${year}`;
}

export function BirthdayAngryCakeDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f7f4ef] px-4">
      <div className="relative flex h-16 w-full max-w-[8rem] items-end justify-between">
        <div className="flex flex-col items-center">
          <div className="h-8 w-1 rounded-full bg-[#5b3a1a]" />
          <div className="mt-[-0.45rem] flex h-7 w-7 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-50 text-sm">
            🎂
          </div>
        </div>
        <div className="mb-1 h-0.5 flex-1 bg-[#a89878]" />
        <div className="h-3 w-0.5 bg-[#8a7a5c]" />
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
