const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

/** Eastern Arabic digits — the ones that actually belong to arabic, not 123. */
export function toArabicDigits(value: number) {
  return String(Math.trunc(value)).replace(/\d/g, (digit) => {
    return ARABIC_DIGITS[Number(digit)] ?? digit;
  });
}

export function rangeToArabicOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let value = min; value <= max; value += 1) {
    options.push({ value, label: toArabicDigits(value) });
  }
  return options;
}
