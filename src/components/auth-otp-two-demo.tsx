export function AuthOtpTwoDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-50 px-3">
      <div className="relative aspect-[3/4] w-[4.5rem]">
        <div className="absolute left-[10%] right-[10%] top-[2%] z-10 flex justify-between">
          <div className="h-3 w-2.5 rounded-full bg-[#3a3530]" />
          <div className="mt-1 h-1 flex-1 rounded-full bg-[#2f2b27] mx-0.5" />
          <div className="h-3 w-2.5 rounded-full bg-[#3a3530]" />
        </div>
        <div className="absolute inset-x-[4%] bottom-[2%] top-[8%] rounded-2xl border border-[#c4b49a] bg-[#e8dfd0]">
          <div
            className="absolute left-1/2 top-[44%] size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a89478] bg-[#d8cbb6] transition duration-700 group-hover:rotate-[120deg]"
          >
            <div className="absolute left-1/2 top-[18%] size-1.5 -translate-x-1/2 rounded-full bg-[#1c1917]" />
            <div className="absolute right-[18%] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#1c1917]" />
            <div className="absolute bottom-[18%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#1c1917]" />
            <div className="absolute left-[18%] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#1c1917]" />
            <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfc0a8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
