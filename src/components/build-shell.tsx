import type { ReactNode } from "react";
import { BackPill } from "@/components/back-pill";

type BuildShellProps = {
  title: string;
  description: string;
  /** where the top-left back pill goes (usually the category page) */
  backHref?: string;
  contentClassName?: string;
  /** hide title/description (creator filming) */
  filming?: boolean;
  children: ReactNode;
};

/**
 * Standard build page layout:
 * - top-left back pill
 * - title + description at the top (centered)
 * - interactive build centered in the remaining space below the header
 *   (never overlays the title)
 */
export function BuildShell({
  title,
  description,
  backHref = "/",
  contentClassName = "max-w-xl",
  filming = false,
  children,
}: BuildShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 sm:left-10 lg:left-16">
        <BackPill href={backHref} />
      </div>

      {filming ? null : (
        <header className="relative z-10 mx-auto w-full max-w-6xl shrink-0 pt-12 text-center sm:pt-4">
          <h1 className="font-display text-2xl tracking-tight text-zinc-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl px-2 text-sm text-zinc-600 sm:text-base sm:whitespace-nowrap">
            {description}
          </p>
        </header>
      )}

      <div
        className={[
          "relative z-0 flex min-h-0 flex-1 items-center justify-center py-8",
          filming ? "pt-14" : "",
        ].join(" ")}
      >
        <div className={`w-full ${contentClassName}`}>{children}</div>
      </div>
    </main>
  );
}
