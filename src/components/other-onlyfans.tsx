"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const FAN_SECONDS = [0, 6, 3.2, 1.8, 1, 0.55];
const MAX_LEVEL = FAN_SECONDS.length - 1;

const ONLYFANS_BLUE = "#00AFF0";

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherOnlyfans() {
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        Welcome to OnlyFans 2067
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
      ) : null}

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
              <div className="mt-1 flex justify-between px-0.5 font-sans text-sm text-zinc-300 tabular-nums">
                {[1, 2, 3, 4, 5].map((mark) => (
                  <span key={mark}>{mark}</span>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
