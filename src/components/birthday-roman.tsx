"use client";

import { useEffect, useMemo, useState } from "react";
import { CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";
import { rangeToRomanOptions, toRoman } from "@/lib/roman";

const MONTH_OPTIONS = rangeToRomanOptions(1, 12);
const DAY_OPTIONS = rangeToRomanOptions(1, 31);

const selectClassName = [
  "w-full cursor-pointer appearance-none rounded-full border border-zinc-300",
  "bg-white px-4 py-2.5 pr-10 text-left font-sans text-sm tabular-nums text-zinc-900",
  "transition hover:border-zinc-900 focus:border-zinc-900 focus:outline-none",
  "bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2371717a%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]",
].join(" ");

type RomanSelectProps = {
  id: string;
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
};

function RomanSelect({
  id,
  label,
  value,
  options,
  onChange,
}: RomanSelectProps) {
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

export function BirthdayRoman({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  // roman numerals start at 1
  const yearMin = Math.max(1, minYear ?? CREATOR_YEAR.min);
  const yearOptions = useMemo(
    () => rangeToRomanOptions(yearMin, CREATOR_YEAR.max),
    [yearMin],
  );

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(
    Math.max(yearMin, initialYear ?? yearMin),
  );

  useEffect(() => {
    if (yearOnly) onYearChange?.(year);
  }, [yearOnly, year, onYearChange]);

  const summary = useMemo(
    () =>
      yearOnly
        ? toRoman(year)
        : `${toRoman(month)} / ${toRoman(day)} / ${toRoman(year)}`,
    [yearOnly, month, day, year],
  );

  function updateYear(next: number) {
    setYear(next);
    onYearChange?.(next);
  }

  return (
    <div className="w-full text-center">
      <p className="font-sans text-2xl tabular-nums tracking-wide text-zinc-900 sm:text-3xl">
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
            <RomanSelect
              id="roman-month"
              label="month"
              value={month}
              options={MONTH_OPTIONS}
              onChange={setMonth}
            />
            <RomanSelect
              id="roman-day"
              label="day"
              value={day}
              options={DAY_OPTIONS}
              onChange={setDay}
            />
          </>
        )}
        <RomanSelect
          id="roman-year"
          label="year"
          value={year}
          options={yearOptions}
          onChange={updateYear}
        />
      </div>
    </div>
  );
}
