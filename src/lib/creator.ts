export type YearPickerProps = {
  /** only the year interaction — used by creator mode */
  yearOnly?: boolean;
  initialYear?: number;
  onYearChange?: (year: number) => void;
};

export const CREATOR_YEAR = {
  min: 1900,
  max: 2026,
} as const;

/** Shared helper for `?creator=true` on build pages. */
export function isCreatorMode(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.includes("true");
  return value === "true";
}
