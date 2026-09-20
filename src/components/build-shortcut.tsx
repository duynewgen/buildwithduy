import Link from "next/link";
import type { Build } from "@/lib/builds";
import { buildHref } from "@/lib/builds";

function BirthdaySliderDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-50 px-4">
      <p className="font-sans text-lg tabular-nums tracking-wide text-zinc-900">
        00 / 00 / 0000
      </p>
      <div className="w-full max-w-[7.5rem]">
        <div className="h-1 w-full rounded-full bg-zinc-200">
          <div className="relative h-1 w-1/3 rounded-full bg-zinc-900">
            <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildDemo({ path }: { path: string }) {
  if (path === "birthday/slider") {
    return <BirthdaySliderDemo />;
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
