"use client";

import { useEffect, useRef, useState } from "react";
import { CREATOR_AGE, type YearPickerProps } from "@/lib/creator";
import {
  DASH_MS,
  DIGIT_GAP_MS,
  MORSE_DIGITS,
  decodeMorseDigit,
  morseGlyphs,
} from "@/lib/morse";

export function BirthdayMorse({
  minYear = CREATOR_AGE.min,
  maxYear = CREATOR_AGE.max,
  onYearChange,
}: YearPickerProps = {}) {
  const min = Math.max(0, minYear);
  const max = Math.max(min, maxYear);
  const [held, setHeld] = useState(false);
  const [preview, setPreview] = useState<"·" | "−" | null>(null);
  const [marks, setMarks] = useState("");
  const [digits, setDigits] = useState("");
  const [message, setMessage] = useState("tap for a dot. hold for a dash.");

  const downAtRef = useRef(0);
  const dashTimerRef = useRef(0);
  const gapTimerRef = useRef(0);
  const marksRef = useRef("");
  const digitsRef = useRef("");
  const holdingRef = useRef(false);

  marksRef.current = marks;
  digitsRef.current = digits;

  useEffect(() => {
    return () => {
      window.clearTimeout(dashTimerRef.current);
      window.clearTimeout(gapTimerRef.current);
    };
  }, []);

  function clearGap() {
    window.clearTimeout(gapTimerRef.current);
  }

  function commitDigit() {
    const pattern = marksRef.current;
    if (!pattern) return;
    const digit = decodeMorseDigit(pattern);
    setMarks("");
    marksRef.current = "";
    if (!digit) {
      setMessage("that isn't 0–9. try that digit again.");
      return;
    }
    const next = `${digitsRef.current}${digit}`.replace(/^0+(?=\d)/, "");
    const value = Number(next);
    if (next.length > 3 || value > max) {
      setDigits("");
      digitsRef.current = "";
      setMessage(`keep it between ${min} and ${max}.`);
      return;
    }
    setDigits(next);
    digitsRef.current = next;
    setMessage(
      value >= min && value <= max
        ? "that's an age, or keep going."
        : "tap the next digit.",
    );
    if (value >= min && value <= max) onYearChange?.(value);
  }

  function armGap() {
    clearGap();
    gapTimerRef.current = window.setTimeout(commitDigit, DIGIT_GAP_MS);
  }

  function pressStart() {
    if (holdingRef.current) return;
    holdingRef.current = true;
    clearGap();
    downAtRef.current = performance.now();
    setHeld(true);
    setPreview("·");
    window.clearTimeout(dashTimerRef.current);
    dashTimerRef.current = window.setTimeout(() => setPreview("−"), DASH_MS);
  }

  function pressEnd() {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    window.clearTimeout(dashTimerRef.current);
    const symbol = performance.now() - downAtRef.current >= DASH_MS ? "-" : ".";
    const next = `${marksRef.current}${symbol}`.slice(0, 5);
    marksRef.current = next;
    setMarks(next);
    setHeld(false);
    setPreview(null);
    if (next.length === 5) commitDigit();
    else armGap();
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape" || event.key === "Tab") return;
      event.preventDefault();
      pressStart();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") return;
      pressEnd();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function reset() {
    clearGap();
    window.clearTimeout(dashTimerRef.current);
    holdingRef.current = false;
    marksRef.current = "";
    digitsRef.current = "";
    setMarks("");
    setDigits("");
    setHeld(false);
    setPreview(null);
    setMessage("tap for a dot. hold for a dash.");
  }

  const shown = `${morseGlyphs(marks)}${preview ? `${marks ? " " : ""}${preview}` : ""}`;
  const age = digits === "" ? null : Number(digits);

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left">
        {MORSE_DIGITS.map((entry) => (
          <div key={entry.digit} className="flex items-baseline gap-2">
            <span className="w-4 font-sans text-sm tabular-nums text-zinc-900">
              {entry.digit}
            </span>
            <span className="font-sans text-xs tracking-widest text-zinc-500">
              {morseGlyphs(entry.pattern)}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="morse pad. tap for a dot, hold for a dash."
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          pressStart();
        }}
        onPointerUp={pressEnd}
        onPointerCancel={pressEnd}
        onContextMenu={(event) => event.preventDefault()}
        className={[
          "mt-5 flex h-36 w-full cursor-pointer select-none items-center justify-center rounded-2xl border text-sm transition",
          held
            ? "border-amber-400 bg-amber-200 text-zinc-900"
            : "border-zinc-300 bg-zinc-50 text-zinc-500",
        ].join(" ")}
      >
        {held ? (preview === "−" ? "dash" : "dot") : "tap or hold"}
      </button>

      <p className="mt-4 min-h-6 font-sans text-lg tracking-[0.35em] text-zinc-900">
        {shown ? (
          shown
        ) : (
          <span className="tracking-normal text-zinc-300">· −</span>
        )}
      </p>
      <p className="font-sans text-3xl tabular-nums text-zinc-900">
        {age === null ? "—" : age}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{message}</p>

      <button
        type="button"
        onClick={reset}
        className="mt-4 cursor-pointer rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
      >
        clear
      </button>
    </div>
  );
}
