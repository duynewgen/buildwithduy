export type YearPickerProps = {
  /** only the year interaction — used by creator mode */
  yearOnly?: boolean;
  /** inclusive floor for the year range (default CREATOR_YEAR.min) */
  minYear?: number;
  initialYear?: number;
  onYearChange?: (year: number) => void;
};

export const CREATOR_YEAR = {
  min: 1900,
  max: 2026,
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
