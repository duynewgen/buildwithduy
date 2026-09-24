"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { categoryHref } from "@/lib/builds";

const linkClassName =
  "font-display text-lg tracking-tight text-zinc-600 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-300 ease-out hover:text-zinc-900 hover:decoration-current";

type MobileTopbarProps = {
  category: string;
  categories: string[];
};

/** Sticky mobile chrome: centered logo + category menu that collapses on scroll down. */
export function MobileTopbar({ category, categories }: MobileTopbarProps) {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y < 16) {
        setMenuCollapsed(false);
      } else if (delta > 8) {
        setMenuCollapsed(true);
      } else if (delta < -8) {
        setMenuCollapsed(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur-sm xl:hidden",
        "px-[clamp(1.25rem,4.5vw,3.5rem)]",
        "pt-[max(0.75rem,env(safe-area-inset-top))]",
        "transition-[padding] duration-300 ease-out",
        menuCollapsed ? "pb-3" : "pb-4",
      ].join(" ")}
    >
      <div className="flex justify-center">
        <div className="w-[clamp(3.75rem,16vw,5.25rem)]">
          <Logo priority size={84} />
        </div>
      </div>

      <div
        className={[
          "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
          menuCollapsed
            ? "mt-0 grid-rows-[0fr] opacity-0"
            : "mt-4 grid-rows-[1fr] opacity-100",
        ].join(" ")}
        aria-hidden={menuCollapsed}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            className={[
              "flex snap-x snap-mandatory gap-5 overflow-x-auto",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "-mx-[clamp(1.25rem,4.5vw,3.5rem)] px-[clamp(1.25rem,4.5vw,3.5rem)]",
            ].join(" ")}
            aria-label="categories"
            inert={menuCollapsed ? true : undefined}
          >
            {categories.map((id) => {
              const isCurrent = id === category;
              return (
                <Link
                  key={id}
                  href={categoryHref(id)}
                  aria-current={isCurrent ? "page" : undefined}
                  tabIndex={menuCollapsed ? -1 : undefined}
                  className={[
                    "shrink-0 snap-start",
                    isCurrent
                      ? "font-display text-lg tracking-tight text-zinc-900"
                      : linkClassName,
                  ].join(" ")}
                >
                  {id}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
