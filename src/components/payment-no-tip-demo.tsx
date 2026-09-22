export function PaymentNoTipDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[9.5rem] rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
        <p className="text-[10px] text-zinc-500">add a tip?</p>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {["15%", "20%", "25%"].map((label) => (
            <div
              key={label}
              className="rounded-md border border-zinc-200 bg-zinc-50 py-1 text-center text-[9px] text-zinc-700"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="relative mt-1.5 overflow-hidden rounded-md py-1 text-center text-[9px] tracking-wide text-zinc-400">
          <span className="transition group-hover:opacity-0">no tip</span>
          <span className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-[8px] text-white opacity-0 transition group-hover:opacity-100">
            subscribe?
          </span>
        </div>
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">$10.00</p>
    </div>
  );
}
