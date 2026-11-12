import { HeadImage } from "@/components/other-file-compressor-two";

const FILE_SRC = "/other/nvidia-offer-letter.png";

export function OtherFileCompressorTwoDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="relative h-[104px] w-20 overflow-hidden">
        {/* only a sliver of his crown peeks in until hover */}
        <div className="absolute -top-[78px] left-1/2 z-10 h-[88px] w-[72px] -translate-x-1/2 transition-transform duration-300 ease-in group-hover:translate-y-20">
          <HeadImage />
        </div>
        <div className="absolute right-1 bottom-1 left-1 origin-bottom transition-transform delay-300 duration-300 ease-in group-hover:scale-y-[0.22]">
          <img
            src={FILE_SRC}
            alt=""
            className="h-12 w-full rounded-sm border border-zinc-200 object-cover object-top"
          />
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-1 rounded-full bg-amber-800" />
      </div>
    </div>
  );
}
