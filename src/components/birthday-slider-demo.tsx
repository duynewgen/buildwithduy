"use client";

function formatToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = String(now.getFullYear()).padStart(4, "0");
  return `${month} / ${day} / ${year}`;
}

export function BirthdaySliderDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-50 px-4">
      <p
        suppressHydrationWarning
        className="font-sans text-lg tabular-nums tracking-wide text-zinc-900"
      >
        {formatToday()}
      </p>
      <div className="w-full max-w-[7.5rem]">
        <div className="h-1 w-full rounded-full bg-zinc-200">
          <div className="relative h-1 w-1/3 rounded-full bg-zinc-900">
            <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
