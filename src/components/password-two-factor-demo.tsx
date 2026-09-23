export function PasswordTwoFactorDemo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 bg-zinc-50 px-3">
      <div className="w-full max-w-[9rem] rounded-lg border border-zinc-200 bg-white px-2.5 py-2 shadow-sm transition duration-500 group-hover:opacity-0">
        <div className="h-1.5 w-10 rounded-full bg-zinc-200" />
        <div className="mt-1.5 h-4 rounded bg-zinc-100" />
        <div className="mt-1 h-4 rounded bg-zinc-100" />
        <div className="mt-2 rounded-full bg-zinc-900 py-1 text-center text-[7px] text-white">
          2fa
        </div>
      </div>
      <p className="font-sans text-[8px] tabular-nums text-zinc-500 transition duration-300 group-hover:opacity-0">
        x² + 12x + 20
      </p>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
        <p className="font-sans text-[9px] tabular-nums text-zinc-800">
          (x+2)(x+10)
        </p>
        <p className="mt-1 text-[8px] text-zinc-500">checked in</p>
      </div>
    </div>
  );
}
