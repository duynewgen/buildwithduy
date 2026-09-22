import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

type IconSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/** Native select with a Lucide chevron (hides the browser default arrow). */
export function IconSelect({ className = "", ...props }: IconSelectProps) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={[
          "w-full cursor-pointer appearance-none pr-10 outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        strokeWidth={1.75}
      />
    </div>
  );
}
