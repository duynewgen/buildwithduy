import Link from "next/link";
import { BirthdayAngryBirdDemo } from "@/components/birthday-angry-bird-demo";
import { BirthdaySliderDemo } from "@/components/birthday-slider-demo";
import type { Build } from "@/lib/builds";
import { buildHref } from "@/lib/builds";

function BuildDemo({ path }: { path: string }) {
  if (path === "birthday/slider") {
    return <BirthdaySliderDemo />;
  }
  if (path === "birthday/angry-bird") {
    return <BirthdayAngryBirdDemo />;
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
      className="group flex w-full max-w-56 flex-col overflow-hidden rounded-2xl border border-zinc-200 transition group-hover:border-zinc-900"
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
