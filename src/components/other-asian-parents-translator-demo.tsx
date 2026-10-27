const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherAsianParentsTranslatorDemo() {
  return (
    <div
      className="flex h-full w-full flex-col justify-center bg-white px-3"
      style={scrappyFont}
    >
      <p className="text-[8px] text-red-800">normal parents</p>
      <p className="mt-0.5 border border-orange-600 bg-white px-1 text-[9px] text-red-950">
        i&apos;m sorry
      </p>
      <p className="mt-1.5 text-[8px] text-red-800">asian parents</p>
      <p className="mt-0.5 min-h-8 border border-red-800 bg-red-100 px-1 text-[9px] leading-tight text-red-800">
        <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          SYNTAX ERROR
        </span>
      </p>
    </div>
  );
}
