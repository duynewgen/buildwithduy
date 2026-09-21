const ROMAN_MAP: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Convert a positive integer (1–3999) to uppercase Roman numerals. */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new RangeError(`toRoman expects an integer 1–3999, got ${n}`);
  }

  let remaining = n;
  let out = "";
  for (const [value, numeral] of ROMAN_MAP) {
    while (remaining >= value) {
      out += numeral;
      remaining -= value;
    }
  }
  return out;
}

export function rangeToRomanOptions(min: number, max: number) {
  return Array.from({ length: max - min + 1 }, (_, i) => {
    const value = min + i;
    return { value, label: toRoman(value) };
  });
}
