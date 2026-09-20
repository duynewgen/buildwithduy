export function BirthdayAngryBirdDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f7f4ef] px-4">
      <div className="relative flex h-16 w-full max-w-[8rem] items-end justify-between">
        <div className="flex flex-col items-center">
          <div className="h-8 w-1 rounded-full bg-[#5b3a1a]" />
          <div className="mt-[-0.35rem] h-5 w-5 rounded-full bg-[#dc2626]" />
        </div>
        <div className="mb-1 h-0.5 flex-1 bg-[#a89878]" />
        <div className="h-3 w-0.5 bg-[#8a7a5c]" />
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">06 / 15 / 1998</p>
    </div>
  );
}
