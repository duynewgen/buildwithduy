import { Scissors } from "lucide-react";

export function PaymentSplitDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-50 px-3">
      <div className="relative aspect-[4/3] w-full max-w-[9.5rem] overflow-hidden rounded-xl border border-[#c4b49a] bg-[#e8dfd0]">
        <div className="absolute left-1/2 top-[28%] z-10 -translate-x-1/2 transition duration-500 group-hover:left-[70%] group-hover:top-[58%] group-hover:translate-x-0">
          <div className="flex size-5 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm transition duration-500 group-hover:rotate-45">
            <Scissors className="h-2.5 w-2.5 text-zinc-700" strokeWidth={2} />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative aspect-[2/1] overflow-hidden rounded-sm border border-emerald-800/30 bg-[#c5e1a5] transition duration-500 group-hover:-translate-y-2">
            <div className="absolute inset-0 transition duration-300 group-hover:opacity-0" />
            <div
              className="absolute inset-0 -translate-x-2 opacity-0 transition duration-500 group-hover:opacity-0 group-hover:delay-150"
              style={{ clipPath: "polygon(0 0, 55% 0, 40% 100%, 0 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#c5e1a5] opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100"
              style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 40% 100%)" }}
            />
          </div>
        </div>
        <p className="absolute inset-x-0 bottom-2 text-center text-[8px] text-zinc-600 opacity-0 transition duration-500 group-hover:opacity-100">
          check splitted
        </p>
      </div>
    </div>
  );
}
