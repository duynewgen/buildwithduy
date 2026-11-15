"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Mic, Plus, ShieldCheck, X } from "lucide-react";
import { Google_Sans } from "next/font/google";
import { MODELS } from "@/components/other-google-ai";

/** this build copies gemini, so it uses google's own font instead of rubik */
const googleSans = Google_Sans({ subsets: ["latin"] });

const DEFAULT_MODEL = "Gemini Pro";
const MODAL_MS = 220;

export function OtherGoogleAiTwo() {
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [open, setOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(320);
  const [prompt, setPrompt] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [priceMounted, setPriceMounted] = useState(false);
  const [priceActive, setPriceActive] = useState(false);
  const closeTimerRef = useRef(0);

  useEffect(() => {
    // the portal needs document.body, so wait for the client
    const frame = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!priceMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePrice();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [priceMounted]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(name: string) {
    setModel(name);
    setOpen(false);
    // every model costs the same
    window.clearTimeout(closeTimerRef.current);
    setPriceMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPriceActive(true));
    });
  }

  function closePrice() {
    setPriceActive(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(
      () => setPriceMounted(false),
      MODAL_MS,
    );
  }

  return (
    <div
      className={`relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#0e1018] px-4 text-zinc-100 ${googleSans.className}`}
    >
      {/* the soft blue glow behind the prompt */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_58%,#1c2a72_0%,#121a45_45%,transparent_80%)]" />

      <div className="relative w-full max-w-3xl">
        <p className="text-center text-3xl tracking-tight text-zinc-200 sm:text-5xl">
          Where should we start?
        </p>

        <div className="mt-10 flex items-center gap-2 rounded-full bg-[#1f1f1f] py-3 pr-4 pl-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:mt-12 sm:gap-3 sm:py-4 sm:pl-5">
          <button
            type="button"
            aria-label="add files"
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-zinc-200 hover:bg-white/10"
          >
            <Plus className="h-6 w-6" strokeWidth={1.75} />
          </button>
          <ShieldCheck
            className="hidden h-5 w-5 shrink-0 text-zinc-400 sm:block"
            strokeWidth={1.75}
          />
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Gemini"
            className="min-w-0 flex-1 bg-transparent text-lg text-zinc-100 outline-none placeholder:text-zinc-400 sm:text-xl"
          />

          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => {
                // fit the list between the button and the bottom of the screen
                const below =
                  window.innerHeight -
                  event.currentTarget.getBoundingClientRect().bottom;
                setMenuHeight(Math.max(160, Math.min(320, below - 56)));
                setOpen((value) => !value);
              }}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-base text-zinc-100 hover:bg-white/10 sm:text-lg"
            >
              <span className="max-w-32 truncate sm:max-w-56">{model}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                strokeWidth={1.75}
              />
            </button>

            {open ? (
              <div
                role="listbox"
                style={{ maxHeight: menuHeight }}
                className="absolute top-full right-0 z-30 mt-3 w-72 overflow-y-auto rounded-2xl bg-[#2a2a2a] py-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              >
                <p className="px-4 pt-1 pb-2 text-sm text-zinc-400">
                  Choose your model
                </p>
                {MODELS.flatMap(({ sign, names }) =>
                  names.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={name === model}
                      onClick={() => pick(name)}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-base hover:bg-white/10"
                    >
                      <span className="w-5 text-center text-zinc-300">
                        {sign}
                      </span>
                      <span className="flex-1">{name}</span>
                      {name === model ? (
                        <Check className="h-4 w-4 text-blue-300" strokeWidth={2} />
                      ) : null}
                    </button>
                  )),
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="use microphone"
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-zinc-200 hover:bg-white/10"
          >
            <Mic className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      {ready && priceMounted
        ? createPortal(
            <div
              className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${googleSans.className}`}
            >
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-black/60 transition-opacity duration-200 ease-out",
                  priceActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={closePrice}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="google-ai-two-price"
                className={[
                  "relative z-10 w-full max-w-sm rounded-3xl bg-[#1f1f1f] p-8 text-center text-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition duration-200 ease-out",
                  priceActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={closePrice}
                  className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
                  aria-label="close"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <p id="google-ai-two-price" className="text-xl text-zinc-300">
                  {model}
                </p>
                <p className="mt-4 text-6xl tabular-nums">
                  $599
                  <span className="text-2xl text-zinc-400">/month</span>
                </p>
                <button
                  type="button"
                  className="mt-8 w-full cursor-pointer rounded-full bg-[#a8c7fa] px-5 py-3 text-lg font-medium text-[#062e6f] hover:bg-[#bcd4fb]"
                >
                  Upgrade
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
