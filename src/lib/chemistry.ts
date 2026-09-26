const SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"] as const;

type Atom = { symbol: string; z: number; count: number };

const ELEMENTS: Atom[] = [
  ["H", 1],
  ["He", 2],
  ["Li", 3],
  ["Be", 4],
  ["B", 5],
  ["C", 6],
  ["N", 7],
  ["O", 8],
  ["F", 9],
  ["Ne", 10],
  ["Na", 11],
  ["Mg", 12],
  ["Al", 13],
  ["Si", 14],
  ["P", 15],
  ["S", 16],
  ["Cl", 17],
  ["Ar", 18],
  ["K", 19],
  ["Ca", 20],
  ["Fe", 26],
  ["Cu", 29],
  ["Zn", 30],
  ["Ag", 47],
  ["Au", 79],
].map(([symbol, z]) => ({ symbol: String(symbol), z: Number(z), count: 1 }));

function subscript(count: number) {
  if (count <= 1) return "";
  return String(count).replace(/\d/g, (digit) => SUB[Number(digit)] ?? digit);
}

function formula(atoms: Atom[]) {
  return atoms
    .filter((atom) => atom.count > 0)
    .map((atom) => `${atom.symbol}${subscript(atom.count)}`)
    .join("");
}

function protons(atoms: Atom[]) {
  return atoms.reduce((total, atom) => total + atom.z * atom.count, 0);
}

function atom(symbol: string, count = 1): Atom {
  const found = ELEMENTS.find((element) => element.symbol === symbol);
  if (!found) throw new Error(`unknown element ${symbol}`);
  return { ...found, count };
}

const FAMOUS: Atom[][] = [
  [atom("H", 2), atom("O")],
  [atom("C"), atom("O", 2)],
  [atom("Na"), atom("Cl")],
  [atom("H"), atom("Cl")],
  [atom("C", 2), atom("H", 6), atom("O")],
  [atom("H", 2), atom("S"), atom("O", 4)],
  [atom("C", 6), atom("H", 12), atom("O", 6)],
  [atom("Fe", 2), atom("O", 3)],
  [atom("C", 6), atom("H", 6)],
  [atom("Na"), atom("O"), atom("H")],
  [atom("Ca"), atom("C"), atom("O", 3)],
  [atom("Ag"), atom("N"), atom("O", 3)],
  [atom("O", 2)],
  [atom("N", 2)],
  [atom("H", 2), atom("O", 2)],
  [atom("K"), atom("Cl")],
  [atom("Fe"), atom("S")],
  [atom("Cu"), atom("O")],
  [atom("Mg"), atom("O")],
  [atom("Si"), atom("O", 2)],
  [atom("Au")],
  [atom("Ag")],
  [atom("Fe")],
];

const famousByValue = new Map<number, string>();
for (const atoms of FAMOUS) {
  const value = protons(atoms);
  if (!famousByValue.has(value)) famousByValue.set(value, formula(atoms));
}

/** A chemical formula whose atomic numbers add up to `n`. */
export function chemistryFor(value: number) {
  const n = Math.trunc(Math.abs(value));
  if (n === 0) return "He−He";
  const known = famousByValue.get(n);
  if (known) return known;

  const heavy = ELEMENTS.filter((element) => element.z > 1 && element.z <= n);
  const base = heavy[n % heavy.length] ?? ELEMENTS[0]!;
  let count = Math.min(4, Math.floor(n / base.z));
  let rest = n - count * base.z;
  while (rest < 0 && count > 1) {
    count -= 1;
    rest = n - count * base.z;
  }

  const parts: Atom[] = [{ ...base, count }];
  if (rest === base.z) {
    parts[0]!.count += 1;
  } else if (rest > 0) {
    const exact = ELEMENTS.find((element) => element.z === rest);
    if (exact) parts.push({ ...exact, count: 1 });
    else if (rest % 8 === 0) parts.push(atom("O", rest / 8));
    else parts.push(atom("H", rest));
  }
  return formula(parts);
}

export function chemistryOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let value = min; value <= max; value += 1) {
    options.push({ value, label: chemistryFor(value) });
  }
  return options;
}
