import { ChevronDown } from "lucide-react";
import { Google_Sans } from "next/font/google";

const googleSans = Google_Sans({ subsets: ["latin"] });

const SIGNS = ["♈ google aries", "♉ google taurus", "♌ google leo pro max"];

export function OtherGoogleAiTwoDemo() {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,#1c2a72,#0e1018_75%)] ${googleSans.className}`}>
      <div className="relative w-36">
        <div className="flex items-center gap-1 rounded-full bg-[#1f1f1f] px-2.5 py-1.5 text-[8px] text-zinc-400">
          <span className="text-zinc-200">+</span>
          <span className="flex-1">ask gemini</span>
          <span className="flex items-center gap-0.5 text-zinc-100">
            gemini pro
            <ChevronDown className="h-2 w-2 transition-transform group-hover:rotate-180" />
          </span>
        </div>
        {/* the dropdown opens to the zodiac on hover */}
        <div className="absolute top-full right-0 mt-1 w-24 origin-top scale-y-0 rounded-lg bg-[#2a2a2a] py-1 opacity-0 transition duration-300 ease-out group-hover:scale-y-100 group-hover:opacity-100">
          {SIGNS.map((sign) => (
            <p key={sign} className="px-1.5 text-[7px] leading-3 text-zinc-200">
              {sign}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
