const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherAsianDemo() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white"
      style={scrappyFont}
    >
      <div className="w-24 rounded-2xl border-4 border-zinc-800 bg-zinc-900 px-1.5 pt-1.5 pb-2">
        <div className="mx-auto mb-1 h-2 w-2 rounded-full border border-zinc-500 bg-black" />
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-black">
          <span className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <span className="pointer-events-none absolute inset-0 bg-white opacity-0 group-hover:animate-asian-shutter" />
        </div>
      </div>
    </div>
  );
}
