/** Physics expressions that evaluate to an integer age. */

function factorPairs(value: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let left = 2; left * left <= value; left += 1) {
    if (value % left === 0) pairs.push([left, value / left]);
  }
  return pairs;
}

function preferred(value: number, options: string[]) {
  if (options.length === 0) return `p = 1·${value}`;
  return options[value % options.length]!;
}

/** An equation that equals `value`. 10 → F = 2·5, 0 → v = 0. */
export function physicsFor(value: number) {
  const n = Math.trunc(Math.abs(value));
  if (n === 0) return "v = 0";
  if (n === 1) return "F = 1·1";

  const options: string[] = [];

  if (n % 2 === 0) {
    options.push(`KE = ½(${n / 2})(2)²`);
  }
  if (n % 8 === 0) {
    options.push(`KE = ½(${n / 8})(4)²`);
  }
  if (n % 10 === 0) {
    options.push(`U = ${n / 10}·10·1`);
  }

  for (const [left, right] of factorPairs(n)) {
    options.push(`F = ${left}·${right}`);
    options.push(`p = ${left}·${right}`);
    options.push(`W = ${left}·${right}`);
    options.push(`V = ${left}·${right}`);
    options.push(`a = ${n * left}/${left}`);
  }

  if (n > 2) {
    options.push(`Δx = ½(2)(${n})`);
  }

  return preferred(n, options);
}

export function physicsOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let value = min; value <= max; value += 1) {
    options.push({ value, label: physicsFor(value) });
  }
  return options;
}
