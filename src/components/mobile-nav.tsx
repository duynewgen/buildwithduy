"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { buildCategories, categoryHref } from "@/lib/builds";

const DRAWER_MS = 220;

const linkClassName =
  "font-display text-3xl tracking-tight text-zinc-400 transition-colors duration-300 ease-out hover:text-zinc-900";

function MenuMark() {
  return (
    <span className="relative block h-2.5 w-4" aria-hidden>
      <span className="absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current" />
      <span className="absolute left-0 top-1 h-0.5 w-4 rounded-full bg-current" />
      <span className="absolute left-0 top-2 h-0.5 w-4 rounded-full bg-current" />
    </span>
  );
}

export function MobileNav({ category }: { category: string }) {
  const categories = buildCategories();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const closeTimer = useRef(0);

  useEffect(() => {
    setMounted(true);
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setActive(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function openMenu() {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function close() {
    setActive(false);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), DRAWER_MS);
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-900 xl:hidden"
        aria-label="open menu"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={openMenu}
      >
        <MenuMark />
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] xl:hidden">
              <button
                type="button"
                aria-label="close menu"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/30 transition-opacity duration-200 ease-out",
                  active ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={close}
              />
              <div
                id="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label="menu"
                className={[
                  "absolute inset-y-0 right-0 flex w-[min(18.5rem,86vw)] flex-col border-l border-zinc-200 bg-white px-6 pb-8 pt-7 shadow-xl transition duration-200 ease-out",
                  active ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={close}
                    aria-label="close"
                    className="inline-flex size-11 items-center justify-center text-zinc-900"
                  >
                    <X className="size-5" strokeWidth={1.75} />
                  </button>
                </div>
                <nav className="mt-2 flex flex-col items-start gap-3" aria-label="categories">
                  {categories.map((id, index) => {
                    const isCurrent = id === category;
                    return (
                      <Link
                        key={id}
                        href={categoryHref(id)}
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={close}
                        style={{ transitionDelay: active ? `${index * 40}ms` : "0ms" }}
                        className={[
                          isCurrent
                            ? "font-display text-3xl tracking-tight text-zinc-900"
                            : linkClassName,
                          "transition duration-300",
                          active
                            ? "translate-x-0 opacity-100"
                            : "translate-x-3 opacity-0",
                        ].join(" ")}
                      >
                        {id}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
