"use client";

import { useMemo, useState } from "react";
import { IconSelect } from "@/components/icon-select";
import {
  CREATOR_YEAR,
  creatorFieldSelectClassName,
  type YearPickerProps,
} from "@/lib/creator";
import { rangeToArabicOptions, toArabicWords } from "@/lib/arabic";

export function BirthdayArabic({
  minYear,
  initialYear,
  onYearChange,
  creatorField = false,
}: YearPickerProps = {}) {
  const yearMin = Math.max(0, minYear ?? CREATOR_YEAR.min);
  const yearOptions = useMemo(
    () => rangeToArabicOptions(yearMin, CREATOR_YEAR.max),
    [yearMin],
  );

  const [year, setYear] = useState<number | null>(
    creatorField ? (initialYear ?? null) : Math.max(yearMin, initialYear ?? yearMin),
  );

  function updateYear(next: number) {
    setYear(next);
    onYearChange?.(next);
  }

  if (creatorField) {
    return (
      <IconSelect
        id="creator-birthyear"
        dir="rtl"
        aria-label="when were you born"
        value={year ?? ""}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          updateYear(next);
        }}
        className={[
          creatorFieldSelectClassName,
          "font-sans",
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

  return (
    <div className="w-full text-center">
      <p className="font-sans text-2xl tracking-wide text-zinc-900 sm:text-3xl" dir="rtl">
        {toArabicWords(safeYear)}
      </p>
      <div className="mx-auto mt-8 max-w-md text-left">
        <label htmlFor="arabic-year" className="text-sm tracking-wide text-zinc-500">
          year
        </label>
        <IconSelect
          id="arabic-year"
          dir="rtl"
          value={safeYear}
          onChange={(event) => updateYear(Number(event.target.value))}
          className="mt-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-left font-sans text-sm tabular-nums text-zinc-900 transition hover:border-zinc-900 focus:border-zinc-900"
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </IconSelect>
      </div>
    </div>
  );
}
