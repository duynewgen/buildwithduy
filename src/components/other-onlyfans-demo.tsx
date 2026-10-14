const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherOnlyfansDemo() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white"
      style={scrappyFont}
    >
      <div className="text-center group-hover:animate-[onlyfans-spin_0.9s_linear]">
        <p className="text-sm text-[#00AFF0]">OnlyFans</p>
        <p className="text-xs text-[#00AFF0]">2030</p>
      </div>
    </div>
  );
}
