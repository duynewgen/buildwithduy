const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;

const TEENS = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
] as const;

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
] as const;

/** Words for 1–99 (lowercase, space-separated). */
export function underHundredToWords(n: number): string {
  if (n < 1 || n > 99) {
    throw new RangeError(`underHundredToWords expects 1–99, got ${n}`);
  }
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones === 0 ? TENS[tens] : `${TENS[tens]} ${ONES[ones]}`;
}

/** Month 1–12 → one … twelve */
export function monthToWords(month: number): string {
  if (month < 1 || month > 12) {
    throw new RangeError(`monthToWords expects 1–12, got ${month}`);
  }
  return underHundredToWords(month);
}

/** Day 1–31 → one … thirty one */
export function dayToWords(day: number): string {
  if (day < 1 || day > 31) {
    throw new RangeError(`dayToWords expects 1–31, got ${day}`);
  }
  return underHundredToWords(day);
}

/**
 * Year 1900–2026 in spoken English, e.g.
 * nineteen ninety nine, two thousand sixteen, twenty twenty one
 */
export function yearToWords(year: number): string {
  if (year < 1900 || year > 2026) {
    throw new RangeError(`yearToWords expects 1900–2026, got ${year}`);
  }

  if (year === 1900) return "nineteen hundred";
  if (year > 1900 && year < 1910) {
    return `nineteen oh ${ONES[year - 1900]}`;
  }
  if (year >= 1910 && year < 2000) {
    return `nineteen ${underHundredToWords(year - 1900)}`;
  }

  if (year === 2000) return "two thousand";
  if (year > 2000 && year < 2010) {
    return `two thousand ${ONES[year - 2000]}`;
  }
  if (year >= 2010 && year < 2020) {
    return `two thousand ${underHundredToWords(year - 2000)}`;
  }

  // 2020–2026 → twenty twenty … twenty twenty six
  return `twenty ${underHundredToWords(year - 2000)}`;
}

export function rangeToWordOptions(
  min: number,
  max: number,
  toWords: (n: number) => string,
) {
  return Array.from({ length: max - min + 1 }, (_, i) => {
    const value = min + i;
    return { value, label: toWords(value) };
  });
}
