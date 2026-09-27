/** Deterministic cursed formulas that evaluate to n (integer math only). */

function isPerfectSquare(n: number) {
  if (n < 2) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

function variantFor(n: number) {
  return Math.abs(n * 17 + 3) % 12;
}

function advancedVariant(n: number) {
  return Math.abs(n * 31 + 7) % 14;
}

function factorize(n: number): number[] {
  const factors: number[] = [];
  let x = Math.abs(n);
  if (x < 2) return [x];
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      factors.push(p);
      x /= p;
    }
  }
  if (x > 1) factors.push(x);
  return factors;
}

function joinProduct(factors: number[]): string {
  if (factors.length === 0) return "1";
  if (factors.length === 1) return String(factors[0]);
  // collapse duplicates into powers: 2,2,2,31 → 2³×31
  const counts = new Map<number, number>();
  for (const f of factors) counts.set(f, (counts.get(f) ?? 0) + 1);
  const parts: string[] = [];
  for (const [base, exp] of counts) {
    const supers = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
    if (exp === 1) parts.push(String(base));
    else if (exp < supers.length) parts.push(`${base}${supers[exp]}`);
    else parts.push(`${base}^${exp}`);
  }
  return parts.join("×");
}

function digitPolynomial(n: number): string {
  const s = String(Math.abs(n));
  const parts: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    const power = s.length - 1 - i;
    if (d === 0) continue;
    if (power === 0) parts.push(String(d));
    else if (power === 1) parts.push(d === 1 ? "10" : `${d}×10`);
    else {
      const supers = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
      const pow = power < supers.length ? supers[power] : `^${power}`;
      parts.push(d === 1 ? `10${pow}` : `${d}×10${pow}`);
    }
  }
  return parts.length > 0 ? parts.join("+") : "0";
}

function nearestPowerOfTwo(n: number): { exp: number; delta: number } {
  const exp = Math.round(Math.log2(Math.max(n, 1)));
  const pow = 2 ** exp;
  return { exp, delta: n - pow };
}

function sumOfOddsFormula(n: number): string | null {
  // n² = 1+3+5+...+(2n-1), so for square roots only
  if (!isPerfectSquare(n)) return null;
  const root = Math.round(Math.sqrt(n));
  return `Σ(2k-1) for k=1…${root}`;
}

/**
 * Long creator formulas. Built so they equal `n`, then ranked so the list
 * does not collapse into factorials.
 */
export function advancedFormulaFor(n: number, avoid?: Set<string>): string {
  if (!Number.isFinite(n) || !Number.isInteger(n)) return String(n);
  if (n < 0) return `-(${advancedFormulaFor(-n)})`;

  const ranked = rankCreatorFormulas(n);
  const choice =
    ranked.find((label) => !avoid?.has(label)) ??
    ranked[0] ??
    digitPolynomial(n);
  return choice;
}

const creatorFamilies = [
  "run",
  "diff",
  "squares",
  "product",
  "gap",
  "base",
  "choose3",
  "choose2",
] as const;

function rankCreatorFormulas(n: number): string[] {
  const grouped = new Map<string, string[]>();
  const seen: string[] = [];
  for (const item of creatorFormulas(n)) {
    if (item.label === String(n) || isTrivialFactorial(item.label)) continue;
    if (item.label.includes("!")) continue;
    if (seen.includes(item.label)) continue;
    seen.push(item.label);
    const bucket = grouped.get(item.family) ?? [];
    bucket.push(item.label);
    grouped.set(item.family, bucket);
  }
  const longest = seen.reduce((max, label) => Math.max(max, label.length), 0);
  const floor = longest >= 9 ? 9 : 0;

  const preferred = creatorFamilies[Math.abs(n * 5 + 2) % creatorFamilies.length]!;
  const strict = rankFamilies(grouped, preferred, floor, false);
  if (strict.length > 0) return strict;
  return rankFamilies(grouped, preferred, floor, true);
}

function rankFamilies(
  grouped: Map<string, string[]>,
  preferred: (typeof creatorFamilies)[number],
  floor: number,
  allowChoose: boolean,
) {
  const ranked: string[] = [];
  const start = creatorFamilies.indexOf(preferred);
  for (let step = 0; step < creatorFamilies.length; step += 1) {
    const family = creatorFamilies[(start + step) % creatorFamilies.length]!;
    if (
      !allowChoose &&
      (family === "choose2" || family === "choose3") &&
      family !== preferred
    ) {
      continue;
    }
    const labels = (grouped.get(family) ?? []).filter(
      (label) => label.length >= floor,
    );
    labels.sort(
      (a, b) => scoreCreator(b) - scoreCreator(a) || a.localeCompare(b),
    );
    for (const label of labels) {
      if (!ranked.includes(label)) ranked.push(label);
    }
  }
  return ranked;
}

function isTrivialFactorial(label: string) {
  return /^\d+!$/.test(label) || /^\d+!÷\d+!$/.test(label);
}

function scoreCreator(label: string) {
  const pluses = label.split("+").length - 1;
  let score = Math.min(label.length, 36);
  if (/[²³⁴⁵⁶⁷⁸⁹]/.test(label) || label.includes("¹⁰") || label.includes("¹¹")) {
    score += 8;
  }
  if (label.includes("×")) score += 7;
  if (label.includes("÷")) score += 9;
  if (label.includes("(")) score += 6;
  if (label.includes("-")) score += 4;
  if (pluses > 1) score += 3;
  if (label.includes("!")) score -= 18;
  if (/^[0-9+]+$/.test(label)) score -= 14;
  if (label.length < 8) score -= 12;
  if (label.length > 46) score -= label.length - 46;
  return score;
}

function prettyPart(n: number): string {
  if (n < 0) return `-${prettyPart(-n)}`;
  if (isPerfectSquare(n) && n >= 4) return `${Math.round(Math.sqrt(n))}²`;
  const factors = factorize(n);
  if (n > 3 && factors.length >= 2) return joinProduct(factors);
  return String(n);
}

type CreatorFormula = { family: string; label: string };

function creatorFormulas(n: number): CreatorFormula[] {
  if (n === 0) {
    return [
      { family: "product", label: "(4²×3)-(6×8)" },
      { family: "product", label: "(2³×9)-(8×9)" },
      { family: "diff", label: "(3³+5)-(4×8)" },
    ];
  }
  if (n === 1) {
    return [
      { family: "diff", label: "(5×5)-(4×6)" },
      { family: "gap", label: "(3³)-(2×13)" },
      { family: "product", label: "(7×8)-(5×11)" },
      { family: "product", label: "(2²×7)-3³" },
    ];
  }

  const options: CreatorFormula[] = [];

  for (const base of [3, 4, 5, 6, 7, 8]) {
    const written = fromBase(n, base);
    if (written.includes("+") || written.includes("×")) {
      options.push({ family: "base", label: written });
    }
  }

  for (let factor = 1; factor * factor <= n; factor += 1) {
    if (factor < 2 || n % factor !== 0) continue;
    const other = n / factor;
    if ((factor + other) % 2 !== 0) continue;
    const sum = (factor + other) / 2;
    const diff = (other - factor) / 2;
    if (diff <= 1 || sum <= 1) continue;
    options.push({ family: "diff", label: `${sum}²-${diff}²` });
    options.push({
      family: "diff",
      label: `(${sum}+${diff})×(${sum}-${diff})`,
    });
  }

  for (let k = 5; k <= 24; k += 1) {
    const choose2 = (k * (k - 1)) / 2;
    if (choose2 > n + 36) break;
    pushOffset(options, "choose2", `(${k}×${k - 1})÷2`, n - choose2, 28);
    if (k >= 6) {
      const choose3 = (k * (k - 1) * (k - 2)) / 6;
      if (Number.isInteger(choose3)) {
        pushOffset(
          options,
          "choose3",
          `(${k}×${k - 1}×${k - 2})÷6`,
          n - choose3,
          36,
        );
      }
    }
  }

  const squares = positiveSquares(n);
  if (squares.length >= 3) {
    options.push({
      family: "squares",
      label: squares.map((root) => `${root}²`).join("+"),
    });
  }

  for (let len = 4; len <= 6; len += 1) {
    if ((2 * n) % len !== 0) continue;
    const start = (2 * n) / len - len + 1;
    if (start % 2 !== 0) continue;
    const first = start / 2;
    if (first <= 0) continue;
    options.push({
      family: "run",
      label: Array.from({ length: len }, (_, index) => String(first + index)).join(
        "+",
      ),
    });
  }

  const floorRoot = Math.floor(Math.sqrt(n));
  for (let root = floorRoot; root >= 2 && floorRoot - root <= 4; root -= 1) {
    const gap = n - root * root;
    if (gap <= 1) continue;
    const gapRoot = Math.floor(Math.sqrt(gap));
    if (gapRoot >= 2) {
      const rest = gap - gapRoot * gapRoot;
      if (rest === 0) {
        options.push({ family: "gap", label: `${root}²+${gapRoot}²` });
      } else if (rest > 0 && rest <= 16) {
        options.push({
          family: "gap",
          label: `${root}²+${gapRoot}²+${prettyPart(rest)}`,
        });
      }
    } else {
      options.push({ family: "gap", label: `${root}²+${prettyPart(gap)}` });
    }
  }

  for (let left = 2; left <= 14; left += 1) {
    for (let right = left; right <= 14; right += 1) {
      const product = left * right;
      if (product > n + 40) break;
      const leftLabel = prettyPart(left);
      const rightLabel = prettyPart(right);
      if (leftLabel === String(left) && rightLabel === String(right)) continue;
      pushOffset(
        options,
        "product",
        `(${leftLabel}×${rightLabel})`,
        n - product,
        24,
      );
    }
  }

  return options;
}

function pushOffset(
  options: CreatorFormula[],
  family: string,
  core: string,
  delta: number,
  limit: number,
) {
  if (Math.abs(delta) > limit) return;
  if (delta === 0) options.push({ family, label: core });
  else if (delta > 0) {
    options.push({ family, label: `${core}+${prettyPart(delta)}` });
  } else {
    options.push({ family, label: `${core}-${prettyPart(-delta)}` });
  }
}

function fromBase(n: number, base: number) {
  const digits: { digit: number; power: number }[] = [];
  let rest = n;
  let power = 0;
  while (rest > 0) {
    digits.push({ digit: rest % base, power });
    rest = Math.floor(rest / base);
    power += 1;
  }
  const parts: string[] = [];
  for (const { digit, power: exp } of digits.reverse()) {
    if (digit === 0) continue;
    if (exp === 0) parts.push(String(digit));
    else if (exp === 1) parts.push(digit === 1 ? String(base) : `${digit}×${base}`);
    else parts.push(digit === 1 ? `${base}${toSuper(exp)}` : `${digit}×${base}${toSuper(exp)}`);
  }
  return parts.join("+");
}

function positiveSquares(n: number): number[] {
  for (let a = Math.floor(Math.sqrt(n)); a >= 0; a -= 1) {
    const left = n - a * a;
    for (let b = Math.floor(Math.sqrt(left)); b >= 0; b -= 1) {
      const mid = left - b * b;
      for (let c = Math.floor(Math.sqrt(mid)); c >= 0; c -= 1) {
        const rest = mid - c * c;
        const d = Math.round(Math.sqrt(rest));
        if (d * d !== rest) continue;
        const roots = [a, b, c, d].filter((root) => root > 0).sort((x, y) => y - x);
        if (roots.reduce((sum, root) => sum + root * root, 0) === n) return roots;
      }
    }
  }
  return [];
}

function toSuper(exp: number): string {
  const supers = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰", "¹¹"];
  return supers[exp] ?? `^${exp}`;
}

/** Simpler inner expansion to avoid infinite recursion. */
function advancedSimple(n: number): string {
  if (isPerfectSquare(n)) return `${Math.round(Math.sqrt(n))}²`;
  const factors = factorize(n);
  if (factors.length >= 2 && factors.length <= 4) return joinProduct(factors);
  if (n >= 100) {
    const hi = Math.floor(n / 10);
    const lo = n % 10;
    return lo === 0 ? `${hi}×10` : `${hi}×10+${lo}`;
  }
  return String(n);
}

/** One human-readable formula that equals `n`. */
export function formulaFor(n: number): string {
  if (!Number.isFinite(n) || !Number.isInteger(n)) return String(n);

  const specials: Record<number, string> = {
    0: "0×999",
    1: "1¹",
    2: "√4",
    3: "(8-2)÷2",
    4: "2²",
    5: "√25",
    6: "3!",
    7: "(3!+8)÷2",
    8: "2³",
    9: "3²",
    10: "2×5",
    11: "√121",
    12: "3!×2",
    13: "16-3",
    14: "2×7",
    15: "3×5",
    16: "2⁴",
    18: "3²×2",
    20: "2²×5",
    21: "3×7",
    24: "4!",
    25: "5²",
    27: "3³",
    28: "4×7",
    30: "5×6",
    31: "32-1",
    32: "2⁵",
    36: "6²",
    42: "6×7",
    49: "7²",
    64: "8²",
    81: "9²",
    100: "10²",
    121: "11²",
    144: "12²",
    169: "13²",
    196: "14²",
    225: "15²",
    256: "2⁸",
    343: "7³",
    512: "2⁹",
    729: "3⁶",
    1000: "10³",
    1024: "2¹⁰",
    1331: "11³",
    1728: "12³",
    1984: "2⁶×31",
    1998: "2×999",
    1999: "2000-1",
    2000: "2×10³",
    2024: "2³×11×23",
    2025: "45²",
    2026: "45²+1",
  };

  if (specials[n] !== undefined) return specials[n];

  if (isPerfectSquare(n)) {
    return `${Math.round(Math.sqrt(n))}²`;
  }

  const v = variantFor(n);

  switch (v) {
    case 0:
      return n % 2 === 0 ? `2×${n / 2}` : `2×${Math.floor(n / 2)}+1`;
    case 1:
      return `(${n}×2)÷2`;
    case 2:
      return `${n + 1}-1`;
    case 3: {
      const a = Math.floor(n / 2);
      return `${a}+${n - a}`;
    }
    case 4:
      return n % 3 === 0 ? `3×${n / 3}` : `${n}-0`;
    case 5: {
      if (n >= 10) {
        const tens = Math.floor(n / 10) * 10;
        const rem = n - tens;
        return rem === 0 ? `${tens / 10}×10` : `${tens}+${rem}`;
      }
      return `${n}×1`;
    }
    case 6:
      return n % 5 === 0 ? `5×${n / 5}` : `(${n}+${n})÷2`;
    case 7:
      return `${n}¹`;
    case 8:
      return n % 4 === 0 ? `4×${n / 4}` : `${n + 3}-3`;
    case 9: {
      if (n >= 100) {
        const hi = Math.floor(n / 100);
        const lo = n % 100;
        return lo === 0 ? `${hi}×100` : `${hi}×100+${lo}`;
      }
      return `√${n * n}`;
    }
    case 10:
      return n % 9 === 0 ? `9×${n / 9}` : `${n}×2÷2`;
    default: {
      if (n >= 1000) {
        const round = Math.round(n / 100) * 100;
        const delta = n - round;
        if (delta === 0) return `${round / 100}×100`;
        if (delta > 0) return `${round}+${delta}`;
        return `${round}-${-delta}`;
      }
      return `${n}+0`;
    }
  }
}

export function formulaOptions(
  min: number,
  max: number,
  mode: "normal" | "advanced" = "normal",
): { value: number; label: string }[] {
  const avoid = new Set<string>();
  const options: { value: number; label: string }[] = [];
  for (let n = min; n <= max; n++) {
    const label =
      mode === "advanced" ? advancedFormulaFor(n, avoid) : formulaFor(n);
    avoid.add(label);
    options.push({ value: n, label });
  }
  return options;
}
