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

function underThousandToWords(n: number): string {
  if (n < 1 || n > 999) {
    throw new RangeError(`underThousandToWords expects 1–999, got ${n}`);
  }
  if (n < 100) return underHundredToWords(n);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const head = `${ONES[hundreds]} hundred`;
  return rest === 0 ? head : `${head} ${underHundredToWords(rest)}`;
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
 * Year 0–2026 in spoken English.
 * 1900–2026 keep the usual birthday phrasing
 * (nineteen ninety nine, twenty twenty one, …).
 */
export function yearToWords(year: number): string {
  if (!Number.isInteger(year) || year < 0 || year > 2026) {
    throw new RangeError(`yearToWords expects 0–2026, got ${year}`);
  }

  if (year === 0) return "zero";

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
  if (year >= 2020 && year <= 2026) {
    return `twenty ${underHundredToWords(year - 2000)}`;
  }

  if (year < 1000) return underThousandToWords(year);

  const thousands = Math.floor(year / 1000);
  const rest = year % 1000;
  const head =
    thousands === 1 ? "one thousand" : `${ONES[thousands]} thousand`;
  return rest === 0 ? head : `${head} ${underThousandToWords(rest)}`;
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
