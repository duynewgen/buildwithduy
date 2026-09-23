export function PaymentCardDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="grid grid-cols-5 gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="relative h-9 w-6">
            <div
              className={[
                "absolute inset-0 flex items-center justify-center rounded-[3px] border border-zinc-700 bg-zinc-900 transition duration-500",
                index === 2
                  ? "group-hover:translate-x-1 group-hover:-rotate-6 group-hover:opacity-0"
                  : "",
              ].join(" ")}
            >
              <span className="text-[8px] text-zinc-400">♠</span>
            </div>
            {index === 2 ? (
              <div className="absolute inset-0 flex flex-col justify-between rounded-[3px] border border-rose-200 bg-white p-0.5 font-sans text-[7px] tabular-nums leading-none text-rose-700 opacity-0 shadow-sm transition duration-500 group-hover:opacity-100">
                <span>K</span>
                <span className="self-center text-[8px]">♥</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="relative h-4 font-sans text-sm tabular-nums text-zinc-700">
        <span className="transition group-hover:opacity-0">$10.00</span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          $10+
        </span>
      </p>
    </div>
  );
}
