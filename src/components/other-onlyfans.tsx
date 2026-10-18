"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FAN_SECONDS = [0, 3.2, 1.5, 0.8, 0.42, 0.22];
const MAX_LEVEL = FAN_SECONDS.length - 1;
const MODAL_MS = 220;

const ONLYFANS_BLUE = "#00AFF0";
const FAN_SRC = "/other/onlyfan.png";

const PLANS = [
  { name: "Basic", price: "$49.99", highlighted: false },
  { name: "Pro Max", price: "$99.99", highlighted: true },
];

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherOnlyfans() {
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState(0);
  const [planDismissed, setPlanDismissed] = useState(false);
  const [planMounted, setPlanMounted] = useState(false);
  const [planActive, setPlanActive] = useState(false);

  const planOpen = level >= 4 && !planDismissed;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (level < 4) setPlanDismissed(false);
  }, [level]);

  useEffect(() => {
    if (!planOpen) return;
    setPlanMounted(true);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPlanActive(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [planOpen]);

  useEffect(() => {
    if (planOpen || !planMounted) return;
    setPlanActive(false);
    const timer = window.setTimeout(() => setPlanMounted(false), MODAL_MS);
    return () => window.clearTimeout(timer);
  }, [planOpen, planMounted]);

  useEffect(() => {
    if (!planMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPlanDismissed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [planMounted]);

  useEffect(() => {
    const main = document.querySelector("main");
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlBackground = html.style.backgroundColor;
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousMainBackground = main?.style.backgroundColor ?? "";

    if (!main || level < 1) {
      if (main) main.style.animation = "";
      return;
    }

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    html.style.backgroundColor = "#000";
    document.body.style.backgroundColor = "#000";
    main.style.backgroundColor = "#fff";
    main.style.transformOrigin = "center center";
    main.style.animation = `onlyfans-spin ${FAN_SECONDS[level]}s linear infinite`;

    return () => {
      main.style.animation = "";
      main.style.backgroundColor = previousMainBackground;
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      html.style.backgroundColor = previousHtmlBackground;
      document.body.style.backgroundColor = previousBodyBackground;
    };
  }, [level]);

  return (
    <div className="w-full text-center text-zinc-900" style={scrappyFont}>
      <p className="text-4xl" style={{ color: ONLYFANS_BLUE }}>
        {level < 1 ? "Welcome to OnlyFan 2030" : "You're in OnlyFan!"}
      </p>
      {level < 1 ? (
        <button
          type="button"
          onClick={() => setLevel(1)}
          className="mt-5 cursor-pointer rounded-full border-2 px-5 py-2 text-xl text-white"
          style={{ ...scrappyFont, backgroundColor: ONLYFANS_BLUE, borderColor: "#0086b8" }}
        >
          Open
        </button>
      ) : (
        <img
          src={FAN_SRC}
          alt=""
          className="mx-auto mt-6 w-72 max-w-full"
        />
      )}

      {mounted && level > 0
        ? createPortal(
            <div
              className="fixed bottom-6 left-1/2 z-[200] w-64 -translate-x-1/2 rounded-3xl border-4 border-zinc-800 bg-zinc-900 px-5 py-4 text-center shadow-xl"
              style={scrappyFont}
            >
              <p className="text-lg" style={{ color: ONLYFANS_BLUE }}>
                Fan
              </p>
              <input
                type="range"
                min={1}
                max={MAX_LEVEL}
                step={1}
                value={level}
                aria-label="fan level"
                onChange={(event) => setLevel(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-[#00AFF0]"
              />
              <div className="mt-1 flex justify-between font-sans text-sm tabular-nums">
                {[1, 2, 3, 4, 5].map((mark) => (
                  <button
                    key={mark}
                    type="button"
                    aria-label={`fan level ${mark}`}
                    onClick={() => setLevel(mark)}
                    className="cursor-pointer px-1 text-zinc-300"
                    style={mark === level ? { color: ONLYFANS_BLUE } : undefined}
                  >
                    {mark}
                  </button>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && planMounted
        ? createPortal(
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  planActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={() => setPlanDismissed(true)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="onlyfan-plan-title"
                className={[
                  "relative z-10 w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl transition duration-200 ease-out",
                  planActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <button
                  type="button"
                  onClick={() => setPlanDismissed(true)}
                  className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="close"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
                <p id="onlyfan-plan-title" className="text-2xl text-zinc-900">
                  Free trial ended
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.name}
                      className="rounded-2xl border-2 px-3 py-5"
                      style={
                        plan.highlighted
                          ? { borderColor: ONLYFANS_BLUE, backgroundColor: ONLYFANS_BLUE }
                          : { borderColor: ONLYFANS_BLUE }
                      }
                    >
                      <p
                        className="text-xl"
                        style={{ color: plan.highlighted ? "#fff" : ONLYFANS_BLUE }}
                      >
                        {plan.name}
                      </p>
                      <p
                        className={[
                          "mt-3 font-sans text-2xl tabular-nums",
                          plan.highlighted ? "text-white" : "text-zinc-900",
                        ].join(" ")}
                      >
                        {plan.price}
                        <span className="text-base">/month</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
