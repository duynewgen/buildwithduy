"use client";

import { useEffect, useMemo, useState } from "react";
import { IconSelect } from "@/components/icon-select";
import {
  CREATOR_YEAR,
  creatorFieldSelectClassName,
  type YearPickerProps,
} from "@/lib/creator";
import {
  advancedFormulaFor,
  formulaFor,
  formulaOptions,
} from "@/lib/math-formulas";

const MONTH_OPTIONS = formulaOptions(1, 12);
const DAY_OPTIONS = formulaOptions(1, 31);

const selectClassName = [
  "rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-left font-sans text-sm text-zinc-900",
  "transition hover:border-zinc-900 focus:border-zinc-900",
].join(" ");

type FormulaSelectProps = {
  id: string;
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
};

function FormulaSelect({
  id,
  label,
  value,
  options,
  onChange,
}: FormulaSelectProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 text-left">
      <label htmlFor={id} className="text-sm tracking-wide text-zinc-500">
        {label}
      </label>
      <IconSelect
        id={id}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={selectClassName}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </IconSelect>
    </div>
  );
}

function formatMonthOrDay(value: number) {
  return String(value).padStart(2, "0");
}

function formatYear(value: number) {
  return String(value).padStart(4, "0");
}

export function BirthdayMath({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
  creatorField = false,
}: YearPickerProps = {}) {
  const yearMin = Math.max(0, minYear ?? CREATOR_YEAR.min);
  const advanced = yearOnly || creatorField;
  const yearOptions = useMemo(
    () =>
      formulaOptions(
        yearMin,
        CREATOR_YEAR.max,
        advanced ? "advanced" : "normal",
      ),
    [yearMin, advanced],
  );

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState<number | null>(
    creatorField ? (initialYear ?? null) : (initialYear ?? yearMin),
  );

  useEffect(() => {
    if (yearOnly && !creatorField && year !== null) onYearChange?.(year);
  }, [yearOnly, creatorField, year, onYearChange]);

  function updateYear(next: number) {
    setYear(next);
    onYearChange?.(next);
  }

  if (creatorField) {
    return (
      <IconSelect
        id="creator-birthyear"
        aria-label="when were you born"
        value={year ?? ""}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          updateYear(next);
        }}
        className={[
          creatorFieldSelectClassName,
          year === null ? "text-zinc-400" : "text-zinc-900",
        ].join(" ")}
      >
        <option value="" disabled>
          add your birthyear
        </option>
        {yearOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </IconSelect>
    );
  }

  const safeYear = year ?? yearMin;
  const formulaSummary = yearOnly
    ? advancedFormulaFor(safeYear)
    : `${formulaFor(month)} / ${formulaFor(day)} / ${formulaFor(safeYear)}`;

  const numberSummary = yearOnly
    ? formatYear(safeYear)
    : `${formatMonthOrDay(month)} / ${formatMonthOrDay(day)} / ${formatYear(safeYear)}`;

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {numberSummary}
      </p>
      <p
        className={[
          "mx-auto mt-2 max-w-2xl font-sans leading-snug text-zinc-500",
          yearOnly ? "text-base sm:text-lg" : "text-sm sm:text-base",
        ].join(" ")}
      >
        {formulaSummary}
      </p>

      <div
        className={
          yearOnly
            ? "mx-auto mt-6 max-w-md"
            : "mx-auto mt-8 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-start sm:gap-5"
        }
      >
        {yearOnly ? null : (
          <>
            <FormulaSelect
              id="math-month"
              label="month"
              value={month}
              options={MONTH_OPTIONS}
              onChange={setMonth}
            />
            <FormulaSelect
              id="math-day"
              label="day"
              value={day}
              options={DAY_OPTIONS}
              onChange={setDay}
            />
          </>
        )}
        <FormulaSelect
          id="math-year"
          label="year"
          value={safeYear}
          options={yearOptions}
          onChange={updateYear}
        />
      </div>
    </div>
  );
}
