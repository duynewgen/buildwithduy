export function PaymentCancelDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="w-full max-w-[9.5rem] rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
        <p className="text-[10px] text-zinc-500">your plan</p>
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <span className="text-[9px] text-zinc-800">pro max</span>
          <span className="font-sans text-[9px] tabular-nums text-zinc-700">
            $29.99
          </span>
        </div>
        <div className="relative mt-2 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 py-1.5 text-center text-[8px] text-zinc-500">
          <span className="transition group-hover:opacity-0">
            cancel subscription
          </span>
          <span className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-[8px] text-white opacity-0 transition group-hover:opacity-100">
            pay $49.99?
          </span>
        </div>
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">$29.99/mo</p>
    </div>
  );
}
