const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const SIGNS = ["♈ aries", "♉ taurus", "♊ gemini", "♋ cancer", "♏ scorpio"];

export function OtherGoogleAiDemo() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white"
      style={scrappyFont}
    >
      <div className="flex w-32 flex-col items-center">
        {/* the model list scrolls through the signs on hover */}
        <div className="h-[60px] w-full overflow-hidden rounded-xl border border-zinc-200 bg-white px-2">
          <div className="transition-transform duration-700 ease-out group-hover:-translate-y-[60px]">
            {SIGNS.map((sign) => (
              <p key={sign} className="h-5 text-left text-[11px] leading-5">
                <span className="text-red-700">{sign.slice(0, 1)}</span>
                {` google ${sign.slice(2)}`}
              </p>
            ))}
          </div>
        </div>
        <span className="mt-2 rounded-full border border-red-900 bg-red-600 px-2.5 py-0.5 text-[10px] text-white">
          choose your model
        </span>
      </div>
    </div>
  );
}
