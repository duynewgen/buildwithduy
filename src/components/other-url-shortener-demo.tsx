const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherUrlShortenerDemo() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white px-3"
      style={scrappyFont}
    >
      <div className="w-full max-w-[9rem] bg-white">
        <p className="text-[8px] text-red-800">Put your website</p>
        <p className="mt-0.5 origin-left truncate border border-orange-600 bg-white px-1 text-[9px] whitespace-nowrap text-red-950 transition-transform duration-1000 ease-out group-hover:scale-x-[0.35]">
          www.duynewgen.com
        </p>
      </div>
    </div>
  );
}
