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
 * - interactive build centered in the remaining space
 */
export function BuildShell({
  backHref = "/",
  contentClassName = "max-w-xl",
  children,
}: BuildShellProps) {
  return (
    <main className="relative flex min-h-dvh flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 sm:left-10 lg:left-16">
        <BackPill href={backHref} />
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center pb-8 pt-16">
        <div className={`w-full ${contentClassName}`}>{children}</div>
      </div>
    </main>
  );
}
