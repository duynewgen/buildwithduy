/** Curated life-stage vibes — short list, clear arc. */

type AgeVibe = {
  age: number;
  label: string;
};

const VIBES: AgeVibe[] = [
  { age: 0, label: "nonexistent old" },
  { age: 3, label: "drool diplomat old" },
  { age: 5, label: "kindergarten old" },
  { age: 7, label: "losing two front teeth old" },
  { age: 9, label: "early-stage crisis old" },
  { age: 11, label: "puberty buffering old" },
  { age: 14, label: "teenage old" },
  { age: 16, label: "fake-id curious old" },
  { age: 18, label: "college old" },
  { age: 20, label: "ramen economist old" },
  { age: 22, label: "unemployed" },
  { age: 24, label: "500-linkedin followers old" },
  { age: 26, label: "unc-level old" },
  { age: 28, label: "back-has-opinions old" },
  { age: 30, label: "thirty-threat old" },
  { age: 33, label: "group-chat elder old" },
  { age: 36, label: "midlife crisis old" },
  { age: 40, label: "hair-turning-gray old" },
  { age: 42, label: "old as fck" },
  { age: 45, label: "whackamole old" },
  { age: 47, label: "fine wine old" },
  { age: 50, label: "roth-ira maxxing out old" },
  { age: 55, label: "nap ambassador old" },
  { age: 60, label: "senior discount unlocked old" },
  { age: 65, label: "teeth falling out old" },
  { age: 70, label: "weather app devotee old" },
  { age: 75, label: "birthday cake fire hazard old" },
  { age: 80, label: "presidentially old" },
  { age: 90, label: "nearly fossilized old" },
  { age: 100, label: "centurion of vibes old" },
];

const byAge = new Map(VIBES.map((vibe) => [vibe.age, vibe.label]));

export function vibeFor(age: number): string {
  return byAge.get(age) ?? `${age} years of vibes`;
}

export function vibeOptions(min: number, max: number) {
  return VIBES.filter((vibe) => vibe.age >= min && vibe.age <= max).map(
    (vibe) => ({
      value: vibe.age,
      label: vibe.label,
    }),
  );
}
