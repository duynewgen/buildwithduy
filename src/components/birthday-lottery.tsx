"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";

type Phase = "idle" | "spinning" | "stopping" | "done";
type ReelKey = "month" | "day" | "year";

const RANGES = {
  month: { min: 1, max: 12 },
  day: { min: 1, max: 31 },
  year: { min: 1900, max: 2026 },
} as const;

const SPIN_MS = 3200;
const NATURAL_SLOW_MS = 1200;
const EARLY_SLOW_MS = 800;
const FAST_TICK_MS = 42;

const pillButtonBase =
  "inline-flex min-w-20 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

function randomInRange(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function formatMonthOrDay(value: number) {
  return String(value).padStart(2, "0");
}

function formatYear(value: number) {
  return String(value).padStart(4, "0");
}

function useLotteryReel(min: number, max: number) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [value, setValue] = useState(min);
  const [pulled, setPulled] = useState(false);

  const phaseRef = useRef(phase);
  const targetRef = useRef(min);
  const slowStartedAtRef = useRef(0);
  const slowDurationRef = useRef(NATURAL_SLOW_MS);
  const spinStartedAtRef = useRef(0);
  const frameRef = useRef(0);
  const lastTickRef = useRef(0);

  phaseRef.current = phase;

  const settle = useEffectEvent(() => {
    setValue(targetRef.current);
    setPhase("done");
    setPulled(false);
  });

  const beginSlowdown = useEffectEvent((duration: number) => {
    if (phaseRef.current !== "spinning") return;
    slowDurationRef.current = duration;
    slowStartedAtRef.current = performance.now();
    setPhase("stopping");
  });

  useEffect(() => {
    if (phase !== "spinning" && phase !== "stopping") return;

    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - lastTickRef.current;
      let interval = FAST_TICK_MS;

      if (phaseRef.current === "stopping") {
        const slowElapsed = now - slowStartedAtRef.current;
        const t = Math.min(1, slowElapsed / slowDurationRef.current);
        interval = FAST_TICK_MS + t * t * 240;
        if (t >= 1) {
          settle();
          return;
        }
      } else if (now - spinStartedAtRef.current >= SPIN_MS) {
        beginSlowdown(NATURAL_SLOW_MS);
      }

      if (elapsed >= interval) {
        lastTickRef.current = now;
        setValue(randomInRange(min, max));
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase, min, max, beginSlowdown, settle]);

  function pull() {
    if (phase === "spinning" || phase === "stopping") return;
    targetRef.current = randomInRange(min, max);
    spinStartedAtRef.current = performance.now();
    setPulled(true);
    setPhase("spinning");
  }

  function stop() {
    beginSlowdown(EARLY_SLOW_MS);
  }

  return {
    phase,
    value,
    pulled,
    spinning: phase === "spinning" || phase === "stopping",
    pull,
    stop,
  };
}

function PullHandle({
  pulled,
  disabled,
  onPull,
  label,
}: {
  pulled: boolean;
  disabled: boolean;
  onPull: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onPull}
      disabled={disabled}
      aria-label={`pull ${label} handle`}
      className={[
        "relative flex h-[7.5rem] w-12 shrink-0 items-end justify-center pb-2",
        "rounded-r-xl border border-l-0 border-zinc-300 bg-gradient-to-b from-zinc-100 to-zinc-200",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition",
        disabled
          ? "cursor-default"
          : "cursor-pointer hover:from-zinc-50 hover:to-zinc-100 active:brightness-95",
      ].join(" ")}
    >
      {/* pivot mount */}
      <span
        aria-hidden
        className="absolute bottom-5 left-0 h-4 w-3 -translate-x-px rounded-r-sm bg-zinc-500 shadow-sm"
      />
      <span
        aria-hidden
        className="absolute bottom-5 left-1.5 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-zinc-600 bg-gradient-to-br from-zinc-300 to-zinc-500"
      />

      {/* lever arm + ball */}
      <span
        aria-hidden
        className={[
          "absolute bottom-6 left-1.5 z-20 flex origin-bottom flex-col items-center",
          "transition-transform duration-300 ease-out",
          pulled ? "rotate-[78deg]" : "rotate-[-8deg] group-hover/handle:rotate-[8deg]",
        ].join(" ")}
        style={{ transformOrigin: "50% 100%" }}
      >
        <span className="mb-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-800 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.25)] ring-1 ring-red-900/40" />
        <span className="h-14 w-1.5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-sm" />
      </span>
    </button>
  );
}

type ColumnProps = {
  label: ReelKey;
  display: string;
  phase: Phase;
  pulled: boolean;
  spinning: boolean;
  onPull: () => void;
  onStop: () => void;
};

function LotteryColumn({
  label,
  display,
  phase,
  pulled,
  spinning,
  onPull,
  onStop,
}: ColumnProps) {
  return (
    <div
      className={[
        "flex min-w-0 flex-col items-center gap-3",
        label === "year" ? "flex-[1.4]" : "flex-1",
      ].join(" ")}
    >
      <span className="text-sm tracking-wide text-zinc-500">{label}</span>

      <div
        className={[
          "group/handle flex w-full items-stretch",
          label === "year" ? "max-w-[12.5rem]" : "max-w-[9.5rem]",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex min-h-[7.5rem] min-w-0 flex-1 items-center justify-center overflow-hidden",
            "rounded-l-xl border border-zinc-300",
            "bg-gradient-to-b from-[#faf7f2] via-[#f3eee6] to-[#ebe4d8]",
            "shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]",
          ].join(" ")}
        >
          {/* window frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-lg border border-zinc-400/50"
          />
          <span
            className={[
              "relative z-10 font-sans tabular-nums tracking-wide text-zinc-900",
              label === "year" ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
              spinning ? "blur-[1px]" : "",
            ].join(" ")}
          >
            {display}
          </span>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-2 h-7 rounded-t-lg bg-gradient-to-b from-[#faf7f2] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 bottom-2 h-7 rounded-b-lg bg-gradient-to-t from-[#ebe4d8] to-transparent"
          />
        </div>

        <PullHandle
          pulled={pulled}
          disabled={spinning}
          onPull={onPull}
          label={label}
        />
      </div>

      <div className="flex min-h-9 items-center justify-center">
        {phase === "spinning" ? (
          <button
            type="button"
            onClick={onStop}
            className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800`}
          >
            stop
          </button>
        ) : phase === "stopping" ? (
          <span className="text-sm text-zinc-500">stopping...</span>
        ) : phase === "done" ? (
          <button
            type="button"
            onClick={onPull}
            className={`${pillButtonBase} border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900`}
          >
            again
          </button>
        ) : (
          <span className="text-xs text-zinc-400">pull</span>
        )}
      </div>
    </div>
  );
}

export function BirthdayLottery({
  yearOnly = false,
  minYear,
  onYearChange,
}: YearPickerProps = {}) {
  const yearMin = minYear ?? RANGES.year.min;
  const yearMax = CREATOR_YEAR.max;
  const month = useLotteryReel(RANGES.month.min, RANGES.month.max);
  const day = useLotteryReel(RANGES.day.min, RANGES.day.max);
  const year = useLotteryReel(yearMin, yearMax);

  useEffect(() => {
    if (yearOnly && year.phase === "done") {
      onYearChange?.(year.value);
    }
  }, [yearOnly, year.phase, year.value, onYearChange]);

  const anyStopping = yearOnly
    ? year.phase === "stopping"
    : month.phase === "stopping" ||
      day.phase === "stopping" ||
      year.phase === "stopping";
  const anySpinning = yearOnly
    ? year.phase === "spinning"
    : month.phase === "spinning" ||
      day.phase === "spinning" ||
      year.phase === "spinning";
  const allDone = yearOnly
    ? year.phase === "done"
    : month.phase === "done" && day.phase === "done" && year.phase === "done";

  const status = anyStopping
    ? "stopping..."
    : anySpinning
      ? "rolling..."
      : allDone
        ? yearOnly
          ? "year locked in. pull again to reroll."
          : "birthday locked in. pull again to reroll a part."
        : yearOnly
          ? "pull the handle to roll a year."
          : "pull each handle to roll month, day, and year.";

  return (
    <div className="w-full text-center">
      <div
        className={
          yearOnly
            ? "mx-auto flex max-w-xs items-start justify-center"
            : "mx-auto flex max-w-2xl items-start justify-center gap-3 sm:gap-5"
        }
      >
        {yearOnly ? null : (
          <>
            <LotteryColumn
              label="month"
              display={formatMonthOrDay(month.value)}
              phase={month.phase}
              pulled={month.pulled}
              spinning={month.spinning}
              onPull={month.pull}
              onStop={month.stop}
            />
            <LotteryColumn
              label="day"
              display={formatMonthOrDay(day.value)}
              phase={day.phase}
              pulled={day.pulled}
              spinning={day.spinning}
              onPull={day.pull}
              onStop={day.stop}
            />
          </>
        )}
        <LotteryColumn
          label="year"
          display={formatYear(year.value)}
          phase={year.phase}
          pulled={year.pulled}
          spinning={year.spinning}
          onPull={year.pull}
          onStop={year.stop}
        />
      </div>

      <p className="mt-8 text-sm text-zinc-500" role="status">
        {status}
      </p>
    </div>
  );
}
