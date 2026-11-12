import { AiChip } from "@/components/other-ai-chip";

export function OtherAiChipDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="relative h-20 w-32 rounded-[50%] border-4 border-amber-900 bg-[radial-gradient(ellipse_at_center,#15803d,#14532d)]">
        <img
          src="/other/ai-chip/jensen.png"
          alt=""
          className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-2 border-white bg-zinc-100 object-cover"
        />
        <div className="absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-zinc-800 font-sans text-[8px] text-white">
          you
        </div>
        {/* the pot slides down to you on hover */}
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-0.5 transition-transform duration-500 ease-out group-hover:translate-y-[90%] group-hover:scale-75">
          <AiChip color="#dc2626" size={18} />
          <AiChip color="#76b900" size={18} />
          <AiChip color="#2563eb" size={18} />
        </div>
      </div>
    </div>
  );
}
