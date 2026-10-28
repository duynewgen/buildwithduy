import { googleSans } from "@/lib/google-translate-font";

export function OtherAsianParentsTranslatorDemo() {
  return (
    <div className={`${googleSans.className} flex h-full w-full items-center gap-1 bg-white px-2`}>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-medium text-[#0b57d0]">normal parents</p>
        <p className="mt-0.5 flex h-10 items-start rounded-md border border-[#e1e3e1] bg-white px-1 pt-1 text-[9px] text-[#444746]">
          i&apos;m sorry
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-medium text-[#0b57d0]">asian parents</p>
        <p className="mt-0.5 h-10 rounded-md bg-[#f0f4f9] px-1 pt-1 text-[9px] leading-tight text-[#5f6368]">
          <span className="group-hover:hidden">translation</span>
          <span className="hidden text-[#444746] group-hover:inline">SYNTAX ERROR</span>
        </p>
      </div>
    </div>
  );
}