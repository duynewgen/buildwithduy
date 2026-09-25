const ONES = [
  "",
  "واحد",
  "اثنان",
  "ثلاثة",
  "أربعة",
  "خمسة",
  "ستة",
  "سبعة",
  "ثمانية",
  "تسعة",
] as const;

const TEENS = [
  "عشرة",
  "أحد عشر",
  "اثنا عشر",
  "ثلاثة عشر",
  "أربعة عشر",
  "خمسة عشر",
  "ستة عشر",
  "سبعة عشر",
  "ثمانية عشر",
  "تسعة عشر",
] as const;

const TENS = [
  "",
  "",
  "عشرون",
  "ثلاثون",
  "أربعون",
  "خمسون",
  "ستون",
  "سبعون",
  "ثمانون",
  "تسعون",
] as const;

const HUNDREDS = [
  "",
  "مئة",
  "مئتان",
  "ثلاثمئة",
  "أربعمئة",
  "خمسمئة",
  "ستمئة",
  "سبعمئة",
  "ثمانمئة",
  "تسعمئة",
] as const;

function join(parts: string[]) {
  return parts.filter(Boolean).join(" و");
}

/** 0–99 in arabic words. */
function belowHundred(value: number) {
  if (value < 10) return ONES[value] ?? "";
  if (value < 20) return TEENS[value - 10] ?? "";
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  if (ones === 0) return TENS[tens] ?? "";
  return `${ONES[ones]} و${TENS[tens]}`;
}

/** 0–999 in arabic words. */
function belowThousand(value: number) {
  if (value < 100) return belowHundred(value);
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  return join([HUNDREDS[hundreds] ?? "", rest ? belowHundred(rest) : ""]);
}

/**
 * A year (or any whole number from 0 up) spelled in arabic.
 * 1 → واحد, 2026 → ألفان وستة وعشرون.
 */
export function toArabicWords(value: number) {
  const year = Math.trunc(Math.abs(value));
  if (year === 0) return "صفر";
  if (year < 1000) return belowThousand(year);

  const thousands = Math.floor(year / 1000);
  const rest = year % 1000;
  const thousandWord =
    thousands === 1 ? "ألف" : thousands === 2 ? "ألفان" : `${ONES[thousands]} آلاف`;

  return join([thousandWord, rest ? belowThousand(rest) : ""]);
}

export function rangeToArabicOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let value = min; value <= max; value += 1) {
    options.push({ value, label: toArabicWords(value) });
  }
  return options;
}
