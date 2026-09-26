export const MORSE_DIGITS = [
  { digit: "0", pattern: "-----" },
  { digit: "1", pattern: ".----" },
  { digit: "2", pattern: "..---" },
  { digit: "3", pattern: "...--" },
  { digit: "4", pattern: "....-" },
  { digit: "5", pattern: "....." },
  { digit: "6", pattern: "-...." },
  { digit: "7", pattern: "--..." },
  { digit: "8", pattern: "---.." },
  { digit: "9", pattern: "----." },
] as const;

const DIGIT_BY_PATTERN = new Map(
  MORSE_DIGITS.map((entry) => [entry.pattern, entry.digit]),
);

/** A short tap is a dot. Holding past this becomes a dash. */
export const DASH_MS = 220;

/** Quiet this long after a tap and the current marks become one digit. */
export const DIGIT_GAP_MS = 700;

export function decodeMorseDigit(pattern: string) {
  return DIGIT_BY_PATTERN.get(pattern as (typeof MORSE_DIGITS)[number]["pattern"]) ?? null;
}

export function morseGlyphs(pattern: string) {
  return pattern
    .split("")
    .map((symbol) => (symbol === "-" ? "−" : "·"))
    .join(" ");
}
