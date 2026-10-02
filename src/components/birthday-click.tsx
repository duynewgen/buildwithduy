"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CREATOR_AGE, CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";

type Step = "month" | "day" | "year";
type Phase = "idle" | "running" | "done";

const ALL_STEPS: Step[] = ["month", "day", "year"];

const RANGES = {
  month: { min: 1, max: 12 },
  day: { min: 1, max: 31 },
  year: { min: CREATOR_YEAR.min, max: CREATOR_YEAR.max },
} as const;

const DURATION_MS = 3000;
const RIPPLE_MS = 380;
const MODAL_MS = 220;

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

function formatYear(value: number | null, compact = false) {
  if (value === null) return compact ? "--" : "----";
  return compact ? String(value) : String(value).padStart(4, "0");
}

type ClickDirection = "up" | "down";

function clicksToValue(
  step: Step,
  clicks: number,
  yearMin: number,
  yearMax: number,
  direction: ClickDirection,
) {
  if (direction === "down") {
    if (step === "year") return yearMax - clicks;
    if (step === "month") return RANGES.month.max - clicks;
    return RANGES.day.max - clicks;
  }
  if (step === "year") return yearMin + clicks;
  return clicks;
}

export function BirthdayClick({
  yearOnly = false,
  minYear,
  maxYear,
  initialYear,
  onYearChange,
  direction = "up",
}: YearPickerProps & { direction?: ClickDirection } = {}) {
  const yearMin = minYear ?? CREATOR_YEAR.min;
  const yearMax = maxYear ?? CREATOR_YEAR.max;
  const countingAge = yearMax <= CREATOR_AGE.max && yearMin === CREATOR_AGE.min;
  const showAgeModal = yearOnly && countingAge;
  const countingDown = direction === "down";
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
  const [mounted, setMounted] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [resultAge, setResultAge] = useState<number | null>(null);

  const phaseRef = useRef(phase);
  const clicksRef = useRef(0);
  const stepRef = useRef(step);
  const startedAtRef = useRef(0);
  const rippleIdRef = useRef(0);
  const pressTimerRef = useRef(0);
  const modalCloseTimerRef = useRef(0);
  const boxRef = useRef<HTMLButtonElement>(null);
  const onYearChangeRef = useRef(onYearChange);
  onYearChangeRef.current = onYearChange;

  phaseRef.current = phase;
  stepRef.current = step;

  const range =
    step === "year"
      ? { min: yearMin, max: yearMax }
      : RANGES[step];
  const stepIndex = steps.indexOf(step);

  const openAgeModal = useCallback((age: number) => {
    window.clearTimeout(modalCloseTimerRef.current);
    setResultAge(age);
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }, []);

  const closeAgeModal = useCallback((after?: () => void) => {
    setModalActive(false);
    window.clearTimeout(modalCloseTimerRef.current);
    modalCloseTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setResultAge(null);
      after?.();
    }, MODAL_MS);
  }, []);

  const lockValue = useEffectEvent((count: number) => {
    const current = stepRef.current;
    const next = clicksToValue(current, count, yearMin, yearMax, direction);
    if (current === "month") setMonth(next);
    else if (current === "day") setDay(next);
    else {
      setYear(next);
      onYearChangeRef.current?.(next);
      if (showAgeModal) openAgeModal(next);
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
    setMounted(true);
  }, []);

  useEffect(() => {
    resetRound();
  }, [step, resetRound]);

  useEffect(() => {
    return () => {
      window.clearTimeout(pressTimerRef.current);
      window.clearTimeout(modalCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAgeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted, closeAgeModal]);

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
      ? countingDown
        ? step === "year"
          ? yearMax
          : range.max
        : null
      : clicksToValue(step, clicks, yearMin, yearMax, direction);

  const error =
    phase === "done" && !inRange
      ? step === "year"
        ? countingAge
          ? countingDown
            ? `need ${yearMax - range.max}–${yearMax - range.min} clicks`
            : `need ${range.min}–${range.max} clicks`
          : countingDown
            ? `need ${yearMax - range.max}–${yearMax - range.min} clicks (year ${range.min}–${range.max})`
            : `need ${range.min - yearMin}–${range.max - yearMin} clicks (year ${range.min}–${range.max})`
        : `need ${range.min}–${range.max} clicks for a ${step}`
      : null;

  const secondsLeft = (remainingMs / 1000).toFixed(1);
  const status =
    phase === "idle"
      ? countingDown
        ? `click the box to count down from ${step === "year" ? yearMax : range.max}. ${DURATION_MS / 1000} seconds start on first click.`
        : `click the box as fast as you can. ${DURATION_MS / 1000} seconds start on first click.`
      : phase === "running"
        ? countingDown
          ? "keep clicking down..."
          : "keep clicking..."
        : inRange
          ? "locked in. try again or continue."
          : "out of range. try again.";

  const summaryMonth =
    step === "month" && (phase !== "idle" || countingDown) ? liveValue : month;
  const summaryDay =
    step === "day" && (phase !== "idle" || countingDown) ? liveValue : day;
  const summaryYear =
    step === "year" && (phase !== "idle" || countingDown) ? liveValue : year;

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {yearOnly
          ? formatYear(summaryYear, countingAge)
          : `${formatMonthOrDay(summaryMonth)} / ${formatMonthOrDay(summaryDay)} / ${formatYear(summaryYear)}`}
      </p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm tracking-wide text-zinc-500">
            {countingAge && step === "year" ? "age" : step}
          </span>
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
            aria-label={
              countingDown
                ? `click box to count down ${step}. ${DURATION_MS / 1000} second timer starts on first click.`
                : `click box for ${step}. ${DURATION_MS / 1000} second timer starts on first click.`
            }
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
              {secondsLeft}
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
              ? countingAge
                ? countingDown
                  ? `${yearMax} − clicks (${range.min}–${range.max})`
                  : `${range.min}–${range.max} clicks`
                : countingDown
                  ? `${yearMax} − clicks → year ${range.min}–${range.max}`
                  : `${range.min - yearMin}–${range.max - yearMin} clicks → year ${range.min}–${range.max}`
              : countingDown
                ? `${range.max} − clicks`
                : `${range.min}–${range.max} clicks`}
            )
          </p>
        </>
      )}
      {yearOnly ? (
        <p className="mt-4 text-sm text-zinc-400">
          {countingAge
            ? countingDown
              ? `age = ${yearMax} − clicks (${range.min}–${range.max})`
              : `age = clicks (${range.min}–${range.max})`
            : countingDown
              ? `year = ${yearMax} − clicks (${range.min}–${range.max})`
              : `year = ${yearMin} + clicks (${range.min}–${range.max})`}
        </p>
      ) : null}

      {mounted && modalMounted && resultAge !== null
        ? createPortal(
            <div
              className={[
                "fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 sm:p-8",
                modalActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-zinc-900/40" aria-hidden />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="click-age-result"
                className={[
                  "relative z-10 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-xl transition duration-200",
                  modalActive
                    ? "translate-y-0 scale-100"
                    : "translate-y-2 scale-95",
                ].join(" ")}
              >
                <p
                  id="click-age-result"
                  className="font-sans text-2xl tracking-wide text-zinc-900 sm:text-3xl"
                >
                  you are{" "}
                  <span className="tabular-nums">{resultAge}</span> years
                  old
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      closeAgeModal(() => {
                        resetRound();
                      })
                    }
                    className={`${pillButtonBase} border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900`}
                  >
                    try again
                  </button>
                  <button
                    type="button"
                    onClick={() => closeAgeModal()}
                    className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800`}
                  >
                    ok
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
