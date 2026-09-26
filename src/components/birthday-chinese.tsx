"use client";

import { useMemo, useState } from "react";
import { IconSelect } from "@/components/icon-select";
import {
  CREATOR_YEAR,
  creatorFieldSelectClassName,
  type YearPickerProps,
} from "@/lib/creator";
import { rangeToChineseOptions, toChineseWords } from "@/lib/chinese";

export function BirthdayChinese({
  minYear,
  maxYear,
  initialYear,
  onYearChange,
  creatorField = false,
}: YearPickerProps = {}) {
  const yearMin = Math.max(0, minYear ?? CREATOR_YEAR.min);
  const yearMax = maxYear ?? CREATOR_YEAR.max;
  const yearOptions = useMemo(
    () => rangeToChineseOptions(yearMin, yearMax),
    [yearMin, yearMax],
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
          year === null ? "text-[#80868b]" : "text-[#202124]",
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
      <p className="font-sans text-2xl tracking-wide text-zinc-900 sm:text-3xl">
        {toChineseWords(safeYear)}
      </p>
      <div className="mx-auto mt-8 max-w-md text-left">
        <label htmlFor="chinese-year" className="text-sm text-zinc-500">
          year
        </label>
        <IconSelect
          id="chinese-year"
          value={safeYear}
          onChange={(event) => updateYear(Number(event.target.value))}
          className="mt-2 rounded-none border-0 border-b border-[#dadce0] bg-transparent px-0 py-2.5 text-left font-sans text-base text-[#202124] transition hover:border-[#673ab7] focus:border-[#673ab7]"
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
