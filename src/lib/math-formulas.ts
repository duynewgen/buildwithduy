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

/** Extra-cursed formulas for creator year mode. */
export function advancedFormulaFor(n: number): string {
  if (!Number.isFinite(n) || !Number.isInteger(n)) return String(n);

  // Keep a few iconic years looking intentionally fancy.
  const specials: Record<number, string> = {
    1900: "19×10²",
    1969: "11×179",
    1984: "2⁶×31",
    1999: "2×10³-1",
    2000: "2×10³",
    2001: "3×23×29",
    2012: "2²×503",
    2020: "2²×5×101",
    2024: "2³×11×23",
    2025: "45²",
    2026: "2×1013",
  };
  if (specials[n] !== undefined) return specials[n];

  if (isPerfectSquare(n)) {
    const root = Math.round(Math.sqrt(n));
    return `(${root})²`;
  }

  const v = advancedVariant(n);
  const factors = factorize(n);

  switch (v) {
    case 0: {
      if (factors.length >= 2) return joinProduct(factors);
      return digitPolynomial(n);
    }
    case 1: {
      const { exp, delta } = nearestPowerOfTwo(n);
      if (exp >= 2 && Math.abs(delta) <= 200 && delta !== 0) {
        return delta > 0 ? `2${toSuper(exp)}+${delta}` : `2${toSuper(exp)}-${-delta}`;
      }
      return digitPolynomial(n);
    }
    case 2: {
      // a³ + b
      const cubeRoot = Math.round(Math.cbrt(n));
      for (const c of [cubeRoot, cubeRoot - 1, cubeRoot + 1]) {
        if (c < 2) continue;
        const cube = c ** 3;
        const delta = n - cube;
        if (Math.abs(delta) > 0 && Math.abs(delta) < 400) {
          return delta > 0 ? `${c}³+${delta}` : `${c}³-${-delta}`;
        }
      }
      return digitPolynomial(n);
    }
    case 3: {
      // a² + b² + c  (try small search)
      for (let a = Math.floor(Math.sqrt(n)); a >= 2; a--) {
        const rem = n - a * a;
        for (let b = Math.floor(Math.sqrt(rem)); b >= 2; b--) {
          const c = rem - b * b;
          if (c >= 0 && c <= 80) {
            return c === 0 ? `${a}²+${b}²` : `${a}²+${b}²+${c}`;
          }
        }
        if (a < Math.floor(Math.sqrt(n)) - 40) break;
      }
      return digitPolynomial(n);
    }
    case 4: {
      // 6! ± k  (720), 7! too big
      const base = 720;
      const delta = n - base;
      if (Math.abs(delta) < 1500) {
        return delta > 0 ? `6!+${delta}` : delta < 0 ? `6!-${-delta}` : "6!";
      }
      return joinProduct(factors.length >= 2 ? factors : [n]);
    }
    case 5: {
      // (a×100) + b with a also expanded
      const hi = Math.floor(n / 100);
      const lo = n % 100;
      const hiPart =
        hi > 1 && factorize(hi).length >= 2 ? joinProduct(factorize(hi)) : String(hi);
      if (lo === 0) return `(${hiPart})×100`;
      return `(${hiPart})×100+${lo}`;
    }
    case 6: {
      // consecutive sum: n = k+(k+1)+...+(k+m-1) = m×(2k+m-1)/2
      for (let m = 3; m <= 15; m++) {
        const twoN = 2 * n;
        if (twoN % m !== 0) continue;
        const inner = twoN / m - m + 1;
        if (inner % 2 !== 0) continue;
        const k = inner / 2;
        if (k > 0) return `${k}+…+${k + m - 1}`;
      }
      return digitPolynomial(n);
    }
    case 7: {
      // mixed: 10³ + a²×b ± c
      const rest = n - 1000;
      if (rest > 0) {
        for (let a = 2; a <= 30; a++) {
          if (rest % (a * a) === 0) {
            const b = rest / (a * a);
            if (b >= 2 && b <= 40) return `10³+${a}²×${b}`;
          }
        }
        return `10³+${rest}`;
      }
      if (rest < 0) return `10³-${-rest}`;
      return "10³";
    }
    case 8: {
      if (factors.length >= 3) return joinProduct(factors);
      const oddSum = sumOfOddsFormula(n);
      if (oddSum) return oddSum;
      return `${n + 7}-7`;
    }
    case 9: {
      // binomial vibes: C(a,2) = a(a-1)/2
      for (let a = Math.ceil((1 + Math.sqrt(1 + 8 * n)) / 2); a >= 3; a--) {
        const binom = (a * (a - 1)) / 2;
        const delta = n - binom;
        if (delta === 0) return `C(${a},2)`;
        if (Math.abs(delta) <= 60) {
          return delta > 0
            ? `C(${a},2)+${delta}`
            : `C(${a},2)-${-delta}`;
        }
        if (a < 20) break;
      }
      return digitPolynomial(n);
    }
    case 10: {
      // nested: ((a×b)+c)×d + e  from prime-ish split
      if (factors.length >= 2) {
        const a = factors[0]!;
        const rest = n / a;
        return `${a}×(${advancedSimple(rest)})`;
      }
      return digitPolynomial(n);
    }
    case 11: {
      const root = Math.floor(Math.sqrt(n));
      const sq = root * root;
      const delta = n - sq;
      if (delta > 0) return `${root}²+${delta}`;
      return digitPolynomial(n);
    }
    case 12: {
      // base-ish: 7×288 + 1 style
      for (const base of [7, 9, 11, 13, 17, 19]) {
        if (n % base === 0) return `${base}×${n / base}`;
        const q = Math.floor(n / base);
        const r = n % base;
        if (q > 10) return `${base}×${q}+${r}`;
      }
      return digitPolynomial(n);
    }
    default:
      return digitPolynomial(n);
  }
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
  const make = mode === "advanced" ? advancedFormulaFor : formulaFor;
  const options: { value: number; label: string }[] = [];
  for (let n = min; n <= max; n++) {
    options.push({ value: n, label: make(n) });
  }
  return options;
}
