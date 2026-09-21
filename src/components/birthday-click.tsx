"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";

type Step = "month" | "day" | "year";
type Phase = "idle" | "running" | "done";

const ALL_STEPS: Step[] = ["month", "day", "year"];

const RANGES = {
  month: { min: 1, max: 12 },
  day: { min: 1, max: 31 },
  year: { min: CREATOR_YEAR.min, max: CREATOR_YEAR.max },
} as const;

const DURATION_MS = 5000;
const RIPPLE_MS = 380;

const pillButtonBase =
  "inline-flex min-w-24 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

function formatMonthOrDay(value: number | null) {
  if (value === null) return "--";
  return String(value).padStart(2, "0");
}

function formatYear(value: number | null) {
  if (value === null) return "----";
  return String(value).padStart(4, "0");
}

function clicksToValue(step: Step, clicks: number, yearMin: number) {
  if (step === "year") return yearMin + clicks;
  return clicks;
}

export function BirthdayClick({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const yearMin = minYear ?? CREATOR_YEAR.min;
  const steps = yearOnly ? (["year"] as Step[]) : ALL_STEPS;
  const [step, setStep] = useState<Step>(yearOnly ? "year" : "month");
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(initialYear ?? null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [clicks, setClicks] = useState(0);
  const [remainingMs, setRemainingMs] = useState(DURATION_MS);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pressed, setPressed] = useState(false);

  const phaseRef = useRef(phase);
  const clicksRef = useRef(0);
  const stepRef = useRef(step);
  const startedAtRef = useRef(0);
  const rippleIdRef = useRef(0);
  const pressTimerRef = useRef(0);
  const boxRef = useRef<HTMLButtonElement>(null);
  const onYearChangeRef = useRef(onYearChange);
  onYearChangeRef.current = onYearChange;

  phaseRef.current = phase;
  stepRef.current = step;

  const range =
    step === "year"
      ? { min: yearMin, max: CREATOR_YEAR.max }
      : RANGES[step];
  const stepIndex = steps.indexOf(step);

  const lockValue = useEffectEvent((count: number) => {
    const current = stepRef.current;
    const next = clicksToValue(current, count, yearMin);
    if (current === "month") setMonth(next);
    else if (current === "day") setDay(next);
    else {
      setYear(next);
      onYearChangeRef.current?.(next);
    }
    setPhase("done");
  });

  const resetRound = useCallback(() => {
    setPhase("idle");
    setClicks(0);
    clicksRef.current = 0;
    setRemainingMs(DURATION_MS);
    startedAtRef.current = 0;
    setRipples([]);
    setPressed(false);
  }, []);

  useEffect(() => {
    resetRound();
  }, [step, resetRound]);

  useEffect(() => {
    return () => {
      window.clearTimeout(pressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "running") return;

    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - startedAtRef.current;
      const left = Math.max(0, DURATION_MS - elapsed);
      setRemainingMs(left);
      if (left <= 0) {
        lockValue(clicksRef.current);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, lockValue]);

  function spawnRipple(clientX: number, clientY: number) {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const id = rippleIdRef.current + 1;
    rippleIdRef.current = id;
    const ripple = {
      id,
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    setRipples((current) => [...current.slice(-18), ripple]);
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== id));
    }, RIPPLE_MS);
  }

  function flashPress() {
    setPressed(true);
    window.clearTimeout(pressTimerRef.current);
    pressTimerRef.current = window.setTimeout(() => {
      setPressed(false);
    }, 90);
  }

  function registerClick(clientX?: number, clientY?: number) {
    if (phaseRef.current === "done") return;

    if (phaseRef.current === "idle") {
      startedAtRef.current = performance.now();
      setPhase("running");
      setRemainingMs(DURATION_MS);
    }

    const next = clicksRef.current + 1;
    clicksRef.current = next;
    setClicks(next);
    flashPress();

    if (clientX !== undefined && clientY !== undefined) {
      spawnRipple(clientX, clientY);
    } else {
      const box = boxRef.current;
      if (box) {
        const rect = box.getBoundingClientRect();
        spawnRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
  }

  function handleBoxPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    registerClick(event.clientX, event.clientY);
  }

  function handleBoxKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    registerClick();
  }

  const lockedValue =
    step === "month" ? month : step === "day" ? day : year;
  const inRange =
    lockedValue !== null &&
    lockedValue >= range.min &&
    lockedValue <= range.max;

  const liveValue =
    phase === "idle"
      ? null
      : clicksToValue(step, clicks, yearMin);

  const error =
    phase === "done" && !inRange
      ? step === "year"
        ? `need ${range.min - yearMin}–${range.max - yearMin} clicks (year ${range.min}–${range.max})`
        : `need ${range.min}–${range.max} clicks for a ${step}`
      : null;

  const secondsLeft = (remainingMs / 1000).toFixed(1);
  const status =
    phase === "idle"
      ? "click the box as fast as you can. 5 seconds start on first click."
      : phase === "running"
        ? "keep clicking..."
        : inRange
          ? "locked in. try again or continue."
          : "out of range. try again.";

  const summaryMonth =
    step === "month" && phase !== "idle" ? liveValue : month;
  const summaryDay = step === "day" && phase !== "idle" ? liveValue : day;
  const summaryYear =
    step === "year" && phase !== "idle" ? liveValue : year;

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {yearOnly
          ? formatYear(summaryYear)
          : `${formatMonthOrDay(summaryMonth)} / ${formatMonthOrDay(summaryDay)} / ${formatYear(summaryYear)}`}
      </p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm tracking-wide text-zinc-500">{step}</span>
          <span className="font-sans text-2xl tabular-nums text-zinc-900">
            {clicks}{" "}
            <span className="text-base text-zinc-500">clicks</span>
          </span>
        </div>

        <div className="relative">
          <button
            ref={boxRef}
            type="button"
            onPointerDown={handleBoxPointerDown}
            onKeyDown={handleBoxKeyDown}
            onContextMenu={(event) => event.preventDefault()}
            disabled={phase === "done"}
            aria-label={`click box for ${step}. five second timer starts on first click.`}
            className={[
              "relative flex h-56 w-full touch-manipulation select-none flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed transition sm:h-64",
              pressed ? "scale-[0.99] bg-zinc-200 border-zinc-900" : "",
              phase === "running"
                ? "border-zinc-900 bg-zinc-100"
                : phase === "done"
                  ? "cursor-default border-zinc-200 bg-zinc-50"
                  : "border-zinc-300 bg-white hover:border-zinc-900 hover:bg-zinc-50",
            ].join(" ")}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                aria-hidden
                className="pointer-events-none absolute z-10 size-10 rounded-full border-2 border-zinc-900 bg-zinc-900/15 animate-click-ripple"
                style={{ left: ripple.x, top: ripple.y }}
              />
            ))}
            <span className="relative z-0 font-sans text-5xl tabular-nums text-zinc-900 sm:text-6xl">
              {phase === "idle" ? "5.0" : secondsLeft}
            </span>
            <span className="relative z-0 text-sm tracking-wide text-zinc-500">
              {phase === "idle"
                ? "seconds · click to start"
                : phase === "running"
                  ? "seconds left"
                  : "time's up"}
            </span>
          </button>

          {phase === "done" ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <button
                type="button"
                onClick={resetRound}
                className={`${pillButtonBase} pointer-events-auto border-zinc-300 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-sm hover:border-zinc-900`}
              >
                try again
              </button>
            </div>
          ) : null}
        </div>

        <p className="min-h-5 text-center text-sm text-red-600" role="status">
          {error ?? ""}
        </p>
        <p className="text-center text-sm text-zinc-500">{status}</p>
      </div>

      {yearOnly ? null : (
        <>
          <div className="mt-8 flex min-h-10 flex-wrap items-center justify-center gap-3">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStep(steps[stepIndex - 1])}
                className={`${pillButtonBase} border-zinc-900 bg-transparent text-zinc-900 hover:bg-zinc-100`}
              >
                previous
              </button>
            ) : null}
            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(steps[stepIndex + 1])}
                disabled={phase === "running" || !inRange}
                className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 disabled:cursor-default disabled:opacity-40`}
              >
                next
              </button>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            step {stepIndex + 1} of {steps.length}: {step} (
            {step === "year"
              ? `${range.min - yearMin}–${range.max - yearMin} clicks → year ${range.min}–${range.max}`
              : `${range.min}–${range.max} clicks`}
            )
          </p>
        </>
      )}
      {yearOnly ? (
        <p className="mt-4 text-sm text-zinc-400">
          year = {yearMin} + clicks ({range.min}–{range.max})
        </p>
      ) : null}
    </div>
  );
}
