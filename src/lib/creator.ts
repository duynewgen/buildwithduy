/** Shared look for inline creator year `<select>` fields. */
export const creatorFieldSelectClassName = [
  "rounded-none border-0 border-b border-[#dadce0] bg-transparent px-0 py-2.5 text-left font-sans text-base text-[#202124]",
  "transition hover:border-[#673ab7] focus:border-[#673ab7]",
].join(" ");

export type YearPickerProps = {
  /** only the year interaction — used by creator mode */
  yearOnly?: boolean;
  /** inclusive floor for the year range (default CREATOR_YEAR.min) */
  minYear?: number;
  /** inclusive ceiling (default CREATOR_YEAR.max; age builds use 100) */
  maxYear?: number;
  initialYear?: number;
  onYearChange?: (year: number) => void;
  /**
   * creator interest form: render only the year dropdown (no modal chrome).
   * used by select-based builds (math, words, roman).
   */
  creatorField?: boolean;
};

export const CREATOR_YEAR = {
  min: 1900,
  max: 2026,
} as const;

export const CREATOR_AGE = {
  min: 0,
  max: 100,
} as const;

/** Parse a typed start year; falls back to CREATOR_YEAR.min when empty/invalid. */
export function parseStartYear(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "" || trimmed === "-") return CREATOR_YEAR.min;
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(n)) return CREATOR_YEAR.min;
  return Math.min(n, CREATOR_YEAR.max);
}

/** Shared helper for `?creator=true` on build pages. */
export function isCreatorMode(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.includes("true");
  return value === "true";
}
