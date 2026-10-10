export function PaymentCancelThreeDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[9.5rem] rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
        <p className="text-[10px] text-zinc-500">cancel?</p>
        <div className="relative mt-1.5 h-10 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-1">
          <p className="text-[7px] leading-tight text-zinc-400 transition group-hover:opacity-0">
            dear subscription team...
          </p>
          <p className="absolute inset-x-1.5 top-1 text-[7px] leading-tight text-zinc-800 opacity-0 transition group-hover:opacity-100">
            in your own words, write 500 words...
          </p>
        </div>
        <p className="mt-1.5 text-center font-sans text-[8px] tabular-nums text-zinc-500">
          0 / 500
        </p>
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">$29.99/mo</p>
    </div>
  );
}
