"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MODAL_MS = 220;

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const PHOTOS = [
  "/other/google-ai/1.webp",
  "/other/google-ai/2.webp",
  "/other/google-ai/3.png",
  "/other/google-ai/4.webp",
  "/other/google-ai/5.webp",
];

/** gemini first, then the rest of the zodiac, each with a pro max */
const SIGNS: [string, string][] = [
  ["♈", "Aries"],
  ["♉", "Taurus"],
  ["♋", "Cancer"],
  ["♌", "Leo"],
  ["♍", "Virgo"],
  ["♎", "Libra"],
  ["♏", "Scorpio"],
  ["♐", "Sagittarius"],
  ["♑", "Capricorn"],
  ["♒", "Aquarius"],
  ["♓", "Pisces"],
];

export const MODELS: { sign: string; names: string[] }[] = [
  { sign: "♊", names: ["Gemini 3 Flash", "Gemini 3 Pro"] },
  ...SIGNS.map(([sign, name]) => ({
    sign,
    names: [`Google ${name}`, `Google ${name} Pro Max`],
  })),
];

function PhotoRun() {
  const row = (copy: string) => (
    <div className="flex shrink-0 gap-3 pr-3">
      {PHOTOS.map((src) => (
        <img
          key={`${copy}-${src}`}
          src={src}
          alt=""
          className="h-28 w-44 rounded-lg object-cover"
        />
      ))}
    </div>
  );

  return (
    <div className="mb-6 overflow-hidden">
      <div className="flex w-max animate-asian-run">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/** portal modal with the repo's ~220ms fade */
function Modal({
  active,
  z,
  labelId,
  onClose,
  className = "",
  children,
}: {
  active: boolean;
  z: string;
  labelId: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return createPortal(
    <div className={`fixed inset-0 ${z} flex items-center justify-center p-4`}>
      <button
        type="button"
        aria-label="close"
        className={[
          "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
          active ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className={[
          "relative z-10 w-full rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
          active
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0",
          className,
        ].join(" ")}
        style={scrappyFont}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="close"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** mount + two-frame activate, unmount after the fade */
function useFade() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function open() {
    window.clearTimeout(timerRef.current);
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setActive(true));
    });
  }

  function close() {
    setActive(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setMounted(false), MODAL_MS);
  }

  return { mounted, active, open, close };
}

export function OtherGoogleAi() {
  const [ready, setReady] = useState(false);
  const [model, setModel] = useState("");
  const list = useFade();
  const price = useFade();

  useEffect(() => {
    // portals need document.body, so wait for the client
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!list.mounted && !price.mounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (price.mounted) price.close();
      else list.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [list, price]);

  function pick(name: string) {
    setModel(name);
    price.open();
  }

  return (
    <div
      className="mx-auto w-full max-w-2xl text-center text-zinc-900"
      style={scrappyFont}
    >
      <PhotoRun />
      <p className="text-4xl text-red-700">Google AI Models</p>

      <button
        type="button"
        onClick={list.open}
        className="mx-auto mt-5 block cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Choose your model
      </button>

      {ready && list.mounted ? (
        <Modal
          active={list.active}
          z="z-[100]"
          labelId="google-ai-models-title"
          onClose={list.close}
          className="flex max-h-[85vh] max-w-md flex-col overflow-hidden"
        >
          <p
            id="google-ai-models-title"
            className="px-8 pt-6 pb-3 text-2xl text-red-700"
          >
            Choose your model
          </p>
          <ul className="overflow-y-auto px-4 pb-4">
            {MODELS.flatMap(({ sign, names }) =>
              names.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => pick(name)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-left text-lg hover:bg-zinc-100"
                  >
                    <span className="w-6 text-center text-xl text-red-700">
                      {sign}
                    </span>
                    {name}
                  </button>
                </li>
              )),
            )}
          </ul>
        </Modal>
      ) : null}

      {ready && price.mounted ? (
        <Modal
          active={price.active}
          z="z-[110]"
          labelId="google-ai-price-title"
          onClose={price.close}
          className="max-w-sm p-6 text-center"
        >
          <p id="google-ai-price-title" className="text-2xl text-red-700">
            {model}
          </p>
          <p className="mt-4 font-sans text-5xl text-zinc-900 tabular-nums">
            $599
          </p>
          <p className="mt-1 text-lg">per month</p>
          <button
            type="button"
            className="mt-6 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
            style={scrappyFont}
          >
            Subscribe
          </button>
        </Modal>
      ) : null}
    </div>
  );
}
