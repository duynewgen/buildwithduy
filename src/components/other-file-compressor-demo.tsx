const FILE_SRC = "/other/mcdonalds-job-application.png";

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherFileCompressorDemo() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white"
      style={scrappyFont}
    >
      <div className="relative h-20 w-14">
        <div className="absolute top-0 right-0 left-0 h-1 rounded-full bg-zinc-700" />
        <div className="absolute top-1 right-1 left-1 h-1.5 rounded-sm bg-red-700 transition-transform duration-300 ease-in group-hover:translate-y-8" />
        <div className="absolute right-1 bottom-1 left-1 origin-bottom transition-transform delay-300 duration-300 ease-in group-hover:scale-y-[0.22]">
          <img
            src={FILE_SRC}
            alt=""
            className="h-14 w-full rounded-sm border border-zinc-200 object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
