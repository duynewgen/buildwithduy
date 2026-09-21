function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-zinc-100 ${className}`.trim()}
    />
  );
}

/** Card-shaped placeholder matching BuildShortcut proportions. */
export function BuildShortcutSkeleton() {
  return (
    <div
      aria-hidden
      className="flex w-full max-w-56 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white"
    >
      <SkeletonPulse className="aspect-square w-full rounded-none" />
      <div className="space-y-2 px-3 py-3">
        <SkeletonPulse className="h-5 w-2/3" />
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/** Full category directory loading state — sidebar chrome + card boxes. */
export function CategoryPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <main
      aria-busy="true"
      aria-label="loading"
      className="flex min-h-dvh flex-col xl:grid xl:grid-cols-[clamp(13rem,18vw,17rem)_minmax(0,1fr)]"
    >
      <aside
        className={[
          "relative flex flex-col border-zinc-200",
          "px-[clamp(1.25rem,4.5vw,3.5rem)] pt-[clamp(1.5rem,4vh,3.5rem)]",
          "max-xl:gap-6 max-xl:border-b max-xl:pb-6",
          "xl:sticky xl:top-0 xl:h-dvh xl:gap-0 xl:border-r xl:pb-0",
        ].join(" ")}
      >
        <SkeletonPulse className="size-[clamp(4.25rem,18vw,6rem)] rounded-2xl" />

        <div
          className={[
            "flex gap-5",
            "max-xl:-mx-[clamp(1.25rem,4.5vw,3.5rem)] max-xl:px-[clamp(1.25rem,4.5vw,3.5rem)]",
            "xl:mt-8 xl:flex-col xl:gap-3 xl:px-0",
          ].join(" ")}
        >
          <SkeletonPulse className="h-5 w-20 shrink-0" />
          <SkeletonPulse className="h-5 w-24 shrink-0" />
          <SkeletonPulse className="h-5 w-16 shrink-0" />
          <SkeletonPulse className="h-5 w-14 shrink-0" />
        </div>

        <div
          className={[
            "mt-auto hidden xl:block",
            "-mx-[clamp(1.25rem,4.5vw,3.5rem)]",
            "border-t border-zinc-200",
            "px-[clamp(1.25rem,4.5vw,3.5rem)]",
            "py-[clamp(1.25rem,3vh,2rem)]",
          ].join(" ")}
        >
          <div className="flex flex-col gap-3">
            <SkeletonPulse className="h-5 w-16" />
            <SkeletonPulse className="h-5 w-14" />
          </div>
        </div>
      </aside>

      <section
        className={[
          "flex-1",
          "px-[clamp(1.25rem,4.5vw,4rem)]",
          "py-[clamp(1.75rem,5vh,4rem)]",
          "xl:min-w-0",
        ].join(" ")}
      >
        <ul
          className={[
            "grid gap-[clamp(1rem,2.5vw,1.5rem)]",
            "grid-cols-2",
            "sm:grid-cols-[repeat(auto-fill,minmax(12rem,14rem))]",
          ].join(" ")}
        >
          {Array.from({ length: cards }, (_, index) => (
            <li key={index}>
              <BuildShortcutSkeleton />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

/** Build / experiment page loading state — back pill, title lines, content box. */
export function BuildPageSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="loading"
      className="relative flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-16"
    >
      <div className="absolute left-6 top-6 z-20 sm:left-10 lg:left-16">
        <SkeletonPulse className="h-9 w-20 rounded-full" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 flex-col items-center pt-12 sm:pt-4">
        <SkeletonPulse className="h-8 w-36 sm:h-9 sm:w-44" />
        <SkeletonPulse className="mt-3 h-4 w-72 max-w-full sm:h-5 sm:w-96" />
      </header>

      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center py-8">
        <div className="w-full max-w-md">
          <SkeletonPulse className="h-64 w-full rounded-2xl sm:h-72" />
          <div className="mt-6 flex justify-center gap-3">
            <SkeletonPulse className="h-9 w-24 rounded-full" />
            <SkeletonPulse className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
