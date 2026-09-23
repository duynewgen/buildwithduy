export function AuthPayToProveDemo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 bg-zinc-50 px-3">
      <div className="w-full max-w-[9rem] rounded-lg border border-zinc-200 bg-white px-2.5 py-2 shadow-sm transition duration-500 group-hover:opacity-0">
        <div className="h-1.5 w-10 rounded-full bg-zinc-200" />
        <div className="mt-1.5 h-4 rounded bg-zinc-100" />
        <div className="mt-1 h-4 rounded bg-zinc-100" />
        <div className="mt-2 rounded-full bg-zinc-900 py-1 text-center text-[7px] text-white">
          verify
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="w-[7.5rem] space-y-1">
          <div className="rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-[7px] text-zinc-600">
            basic · $4.99
          </div>
          <div className="rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-[7px] text-zinc-600">
            pro · $12.99
          </div>
          <div className="rounded-md border border-zinc-900 bg-zinc-900 px-1.5 py-1 text-[7px] text-white">
            pro max · $29.99
          </div>
        </div>
      </div>
    </div>
  );
}
