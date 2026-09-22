"use client";

import { useEffect, useMemo, useState } from "react";
import { IconSelect } from "@/components/icon-select";
import {
  CREATOR_YEAR,
  creatorFieldSelectClassName,
  type YearPickerProps,
} from "@/lib/creator";
import {
  dayToWords,
  monthToWords,
  rangeToWordOptions,
  yearToWords,
} from "@/lib/number-words";

const MONTH_OPTIONS = rangeToWordOptions(1, 12, monthToWords);
const DAY_OPTIONS = rangeToWordOptions(1, 31, dayToWords);

const selectClassName = [
  "rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-left text-sm text-zinc-900",
  "transition hover:border-zinc-900 focus:border-zinc-900",
].join(" ");

type WordSelectProps = {
  id: string;
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
};

function WordSelect({ id, label, value, options, onChange }: WordSelectProps) {
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

export function BirthdayWords({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
  creatorField = false,
}: YearPickerProps = {}) {
  const yearMin = Math.max(0, minYear ?? CREATOR_YEAR.min);
  const yearOptions = useMemo(
    () => rangeToWordOptions(yearMin, CREATOR_YEAR.max, yearToWords),
    [yearMin],
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
  const summary = yearOnly
    ? yearToWords(safeYear)
    : `${monthToWords(month)} / ${dayToWords(day)} / ${yearToWords(safeYear)}`;

  return (
    <div className="w-full text-center">
      <p className="font-sans text-lg leading-snug text-zinc-900 sm:text-xl">
        {summary}
      </p>

      <div
        className={
          yearOnly
            ? "mx-auto mt-8 max-w-md"
            : "mx-auto mt-8 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-start sm:gap-5"
        }
      >
        {yearOnly ? null : (
          <>
            <WordSelect
              id="words-month"
              label="month"
              value={month}
              options={MONTH_OPTIONS}
              onChange={setMonth}
            />
            <WordSelect
              id="words-day"
              label="day"
              value={day}
              options={DAY_OPTIONS}
              onChange={setDay}
            />
          </>
        )}
        <WordSelect
          id="words-year"
          label="year"
          value={safeYear}
          options={yearOptions}
          onChange={updateYear}
        />
      </div>
    </div>
  );
}
