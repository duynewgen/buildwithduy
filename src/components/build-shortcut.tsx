import Link from "next/link";
import { BirthdayAngryCakeDemo } from "@/components/birthday-angry-cake-demo";
import { BirthdayLotteryDemo } from "@/components/birthday-lottery-demo";
import { BirthdaySliderDemo } from "@/components/birthday-slider-demo";
import { BirthdayWordsDemo } from "@/components/birthday-words-demo";
import type { Build } from "@/lib/builds";
import { buildHref } from "@/lib/builds";

function BuildDemo({ path }: { path: string }) {
  if (path === "birthday/slider") {
    return <BirthdaySliderDemo />;
  }
  if (path === "birthday/angry-cake") {
    return <BirthdayAngryCakeDemo />;
  }
  if (path === "birthday/lottery") {
    return <BirthdayLotteryDemo />;
  }
  if (path === "birthday/words") {
    return <BirthdayWordsDemo />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50">
      <span className="text-sm text-zinc-400">preview</span>
    </div>
  );
}

type BuildShortcutProps = {
  build: Build;
};

export function BuildShortcut({ build }: BuildShortcutProps) {
  return (
    <Link
      href={buildHref(build)}
      className="group flex w-full max-w-56 cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-200 ease-out hover:-translate-y-1 hover:border-zinc-900 hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden border-b border-zinc-200">
        <BuildDemo path={build.path} />
      </div>
      <div className="px-3 py-3 text-left">
        <h2 className="font-display text-xl tracking-tight text-zinc-900">
          {build.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 sm:text-md">
          {build.description}
        </p>
      </div>
    </Link>
  );
}
