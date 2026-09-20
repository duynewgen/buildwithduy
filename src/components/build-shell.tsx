import type { ReactNode } from "react";
import { BackPill } from "@/components/back-pill";

type BuildShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

/**
 * Standard build page layout:
 * - top-left back pill
 * - title + description pinned at the top (centered)
 * - interactive build content vertically + horizontally centered in the viewport
 */
export function BuildShell({ title, description, children }: BuildShellProps) {
  return (
    <main className="relative min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 sm:left-10 lg:left-16">
        <BackPill href="/" />
      </div>

      <header className="relative z-10 mx-auto w-full max-w-6xl pt-12 text-center sm:pt-4">
        <h1 className="font-display text-2xl tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl mx-auto px-2 text-sm text-zinc-600 sm:text-base sm:whitespace-nowrap">
          {description}
        </p>
      </header>

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-auto w-full max-w-xl">{children}</div>
      </div>
    </main>
  );
}
