export function PaymentCancelTwoDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[9.5rem] rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
        <p className="text-[10px] text-zinc-500">cancel?</p>
        <div className="relative mt-1.5 h-8 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
          <div className="absolute inset-y-0 left-0 w-1/4 rounded-md bg-zinc-900 transition-[width] duration-500 group-hover:w-full" />
        </div>
        <div className="relative mt-1.5 h-4 overflow-hidden text-center text-[8px] text-zinc-500">
          <span className="transition group-hover:opacity-0">are you sure?</span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
            half off?
          </span>
        </div>
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">$29.99/mo</p>
    </div>
  );
}
