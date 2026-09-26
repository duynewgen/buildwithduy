"use client";

import { useMemo, useState } from "react";
import { IconSelect } from "@/components/icon-select";
import {
  CREATOR_AGE,
  CREATOR_YEAR,
  creatorFieldSelectClassName,
  type YearPickerProps,
} from "@/lib/creator";
import { physicsFor, physicsOptions } from "@/lib/physics";

export function BirthdayPhysics({
  minYear,
  maxYear,
  initialYear,
  onYearChange,
  creatorField = false,
}: YearPickerProps = {}) {
  const yearMin = Math.max(0, minYear ?? CREATOR_AGE.min);
  const yearMax = maxYear ?? (yearMin === 0 ? CREATOR_AGE.max : CREATOR_YEAR.max);
  const countingAge = yearMax <= CREATOR_AGE.max && yearMin === CREATOR_AGE.min;
  const options = useMemo(
    () => physicsOptions(yearMin, yearMax),
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
        aria-label={countingAge ? "how old are you" : "when were you born"}
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
          {countingAge ? "add your age" : "add your birthyear"}
        </option>
        {options.map((option) => (
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
      <p className="font-sans text-2xl tabular-nums tracking-wide text-zinc-900 sm:text-3xl">
        {safeYear}
      </p>
      <p className="mt-2 font-sans text-base text-zinc-500">{physicsFor(safeYear)}</p>
    </div>
  );
}
