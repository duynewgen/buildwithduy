import { CategoryShell } from "@/components/category-directory";

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

/** Main content only — real menu stays via CategoryShell. */
export function CategoryContentSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <ul
      aria-busy="true"
      aria-label="loading"
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
  );
}

/** Category page loading: live sidebar + skeleton card boxes. */
export function CategoryPageSkeleton({
  category,
  cards = 6,
}: {
  category: string;
  cards?: number;
}) {
  return (
    <CategoryShell category={category}>
      <CategoryContentSkeleton cards={cards} />
    </CategoryShell>
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
