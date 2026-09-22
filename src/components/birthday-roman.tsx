"use client";

import { useEffect, useMemo, useState } from "react";
import { IconSelect } from "@/components/icon-select";
import {
  CREATOR_YEAR,
  creatorFieldSelectClassName,
  type YearPickerProps,
} from "@/lib/creator";
import { rangeToRomanOptions, toRoman } from "@/lib/roman";

const MONTH_OPTIONS = rangeToRomanOptions(1, 12);
const DAY_OPTIONS = rangeToRomanOptions(1, 31);

const selectClassName = [
  "rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-left font-sans text-sm tabular-nums text-zinc-900",
  "transition hover:border-zinc-900 focus:border-zinc-900",
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

export function BirthdayRoman({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
  creatorField = false,
}: YearPickerProps = {}) {
  const yearMin = Math.max(1, minYear ?? CREATOR_YEAR.min);
  const yearOptions = useMemo(
    () => rangeToRomanOptions(yearMin, CREATOR_YEAR.max),
    [yearMin],
  );

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState<number | null>(
    creatorField
      ? (initialYear ?? null)
      : Math.max(yearMin, initialYear ?? yearMin),
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
          "tabular-nums",
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
    ? toRoman(safeYear)
    : `${toRoman(month)} / ${toRoman(day)} / ${toRoman(safeYear)}`;

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
          value={safeYear}
          options={yearOptions}
          onChange={updateYear}
        />
      </div>
    </div>
  );
}
