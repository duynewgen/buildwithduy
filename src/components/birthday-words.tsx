"use client";

import { useEffect, useMemo, useState } from "react";
import { CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";
import {
  dayToWords,
  monthToWords,
  rangeToWordOptions,
  yearToWords,
} from "@/lib/number-words";

const MONTH_OPTIONS = rangeToWordOptions(1, 12, monthToWords);
const DAY_OPTIONS = rangeToWordOptions(1, 31, dayToWords);

const selectClassName = [
  "w-full cursor-pointer appearance-none rounded-full border border-zinc-300",
  "bg-white px-4 py-2.5 pr-10 text-left text-sm text-zinc-900",
  "transition hover:border-zinc-900 focus:border-zinc-900 focus:outline-none",
  "bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2371717a%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]",
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
      <select
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
      </select>
    </div>
  );
}

export function BirthdayWords({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const yearMin = Math.max(0, minYear ?? CREATOR_YEAR.min);
  const yearOptions = useMemo(
    () => rangeToWordOptions(yearMin, CREATOR_YEAR.max, yearToWords),
    [yearMin],
  );

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(initialYear ?? yearMin);

  useEffect(() => {
    if (yearOnly) onYearChange?.(year);
  }, [yearOnly, year, onYearChange]);

  const summary = useMemo(
    () =>
      yearOnly
        ? yearToWords(year)
        : `${monthToWords(month)} / ${dayToWords(day)} / ${yearToWords(year)}`,
    [yearOnly, month, day, year],
  );

  function updateYear(next: number) {
    setYear(next);
    onYearChange?.(next);
  }

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
          value={year}
          options={yearOptions}
          onChange={updateYear}
        />
      </div>
    </div>
  );
}
