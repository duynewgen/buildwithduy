/** Shared look for inline creator year `<select>` fields. */
export const creatorFieldSelectClassName = [
  "w-full cursor-pointer appearance-none rounded-md border border-zinc-300",
  "bg-white px-4 py-2.5 pr-10 text-left font-sans text-sm outline-none",
  "transition hover:border-zinc-900 focus:border-zinc-900",
  "bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2371717a%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]",
].join(" ");

export type YearPickerProps = {
  /** only the year interaction — used by creator mode */
  yearOnly?: boolean;
  /** inclusive floor for the year range (default CREATOR_YEAR.min) */
  minYear?: number;
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
