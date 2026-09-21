"use client";

import { useState, type ReactNode } from "react";
import { BackPill } from "@/components/back-pill";

type BuildShellProps = {
  title: string;
  description: string;
  /** where the top-left back pill goes (usually the category page) */
  backHref?: string;
  contentClassName?: string;
  children: ReactNode;
};

/**
 * Standard build page layout:
 * - top-left back pill, with a word toggle under it to hide the title
 * - title + description at the top (centered) unless hidden
 * - interactive build centered in the remaining space below the header
 *   (never overlays the title)
 */
export function BuildShell({
  title,
  description,
  backHref = "/",
  contentClassName = "max-w-xl",
  children,
}: BuildShellProps) {
  const [titleVisible, setTitleVisible] = useState(true);

  return (
    <main className="relative flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 flex flex-col items-start gap-2 sm:left-10 lg:left-16">
        <BackPill href={backHref} />
        <button
          type="button"
          onClick={() => setTitleVisible((visible) => !visible)}
          className="cursor-pointer px-1 text-sm text-zinc-400 transition-colors duration-200 ease-out hover:text-zinc-700"
        >
          {titleVisible ? "hide title" : "show title"}
        </button>
      </div>

      {titleVisible ? (
        <header className="relative z-10 mx-auto w-full max-w-6xl shrink-0 pt-16 text-center sm:pt-4">
          <h1 className="font-display text-2xl tracking-tight text-zinc-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl px-2 text-sm text-zinc-600 sm:text-base sm:whitespace-nowrap">
            {description}
          </p>
        </header>
      ) : null}

      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center py-8">
        <div className={`w-full ${contentClassName}`}>{children}</div>
      </div>
    </main>
  );
}
