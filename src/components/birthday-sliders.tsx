"use client";

import { useEffect, useState } from "react";
import { CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";

type Step = "month" | "day" | "year";

const ALL_STEPS: Step[] = ["month", "day", "year"];

function snapToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

function isWholeNumber(value: number) {
  return Math.abs(value - Math.round(value)) < 1e-9;
}

function formatMonthOrDay(value: number) {
  if (isWholeNumber(value)) {
    return String(Math.round(value)).padStart(2, "0");
  }
  return snapToStep(value, 0.1).toFixed(1);
}

function formatYear(value: number) {
  return String(Math.round(value)).padStart(4, "0");
}

type FieldProps = {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  error?: string | null;
  onChange: (value: number) => void;
};

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  error,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm tracking-wide text-zinc-500">{label}</label>
        <span className="font-sans text-2xl tabular-nums text-zinc-900">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(snapToStep(Number(event.target.value), step))
        }
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
        aria-label={label}
      />
      <div className="flex justify-between text-sm text-zinc-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <p className="min-h-5 text-sm text-red-600" role="status">
        {error ?? ""}
      </p>
    </div>
  );
}

const pillButtonBase =
  "inline-flex min-w-24 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

export function BirthdaySliders({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const steps = yearOnly ? (["year"] as Step[]) : ALL_STEPS;
  const yearMin = yearOnly ? (minYear ?? CREATOR_YEAR.min) : 0;
  const yearMax = CREATOR_YEAR.max;

  const [step, setStep] = useState<Step>(yearOnly ? "year" : "month");
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(initialYear ?? yearMin);

  useEffect(() => {
    if (yearOnly) onYearChange?.(year);
  }, [yearOnly, year, onYearChange]);

  const stepIndex = steps.indexOf(step);
  const monthError = isWholeNumber(month)
    ? null
    : "sorry this is not a valid month";
  const dayError = isWholeNumber(day) ? null : "sorry this is not a valid day";

  function goBack() {
    if (stepIndex > 0) setStep(steps[stepIndex - 1]);
  }

  function goNext() {
    if (stepIndex < steps.length - 1) setStep(steps[stepIndex + 1]);
  }

  function updateYear(next: number) {
    setYear(next);
    onYearChange?.(next);
  }

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {yearOnly
          ? formatYear(year)
          : `${formatMonthOrDay(month)} / ${formatMonthOrDay(day)} / ${formatYear(year)}`}
      </p>

      <div className="mt-12 text-left">
        {step === "month" ? (
          <SliderField
            label="month"
            value={month}
            display={formatMonthOrDay(month)}
            min={0}
            max={12}
            step={0.1}
            error={monthError}
            onChange={setMonth}
          />
        ) : null}

        {step === "day" ? (
          <SliderField
            label="day"
            value={day}
            display={formatMonthOrDay(day)}
            min={0}
            max={31}
            step={0.1}
            error={dayError}
            onChange={setDay}
          />
        ) : null}

        {step === "year" ? (
          <SliderField
            label="year"
            value={year}
            display={formatYear(year)}
            min={yearMin}
            max={yearMax}
            step={1}
            onChange={updateYear}
          />
        ) : null}
      </div>

      {yearOnly ? null : (
        <>
          <div className="mt-10 flex min-h-10 items-center justify-center gap-3">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className={`${pillButtonBase} border-zinc-900 bg-transparent text-zinc-900 hover:bg-zinc-100`}
              >
                previous
              </button>
            ) : null}
            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800`}
              >
                next
              </button>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            step {stepIndex + 1} of {steps.length}: {step}
          </p>
        </>
      )}
    </div>
  );
}
