const DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const;
const UNITS = ["", "十", "百", "千"] as const;

/** 0–9999 spelled the way chinese years are read. 2026 → 二千零二十六. */
export function toChineseWords(value: number) {
  const year = Math.trunc(Math.abs(value));
  if (year === 0) return "零";
  if (year < 10000) return belowTenThousand(year);

  const wan = Math.floor(year / 10000);
  const rest = year % 10000;
  const head = wan === 1 ? "一万" : `${belowTenThousand(wan)}万`;
  if (rest === 0) return head;
  const tail = belowTenThousand(rest);
  return rest < 1000 ? `${head}零${tail}` : `${head}${tail}`;
}

function belowTenThousand(value: number) {
  let text = "";
  let pendingZero = false;

  for (let place = 3; place >= 0; place -= 1) {
    const digit = Math.floor(value / 10 ** place) % 10;
    if (digit === 0) {
      if (text) pendingZero = true;
      continue;
    }

    if (pendingZero) {
      text += "零";
      pendingZero = false;
    }

    const skipOne =
      digit === 1 && place === 1 && text === "";
    text += skipOne ? "十" : `${DIGITS[digit]}${UNITS[place]}`;
  }

  return text;
}

export function rangeToChineseOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let value = min; value <= max; value += 1) {
    options.push({ value, label: toChineseWords(value) });
  }
  return options;
}
