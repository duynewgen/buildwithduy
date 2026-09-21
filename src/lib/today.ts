/** Local calendar date parts for thumbnail demos (month/day/year). */
export function getTodayParts() {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, "0"),
    day: String(now.getDate()).padStart(2, "0"),
    year: String(now.getFullYear()).padStart(4, "0"),
  };
}

/** e.g. "09 / 20 / 2026" — use with suppressHydrationWarning in demos */
export function formatToday() {
  const { month, day, year } = getTodayParts();
  return `${month} / ${day} / ${year}`;
}
