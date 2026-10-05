/** Curated life-stage vibes — short list, clear arc. */

type AgeVibe = {
  age: number;
  name: string;
};

const VIBES: AgeVibe[] = [
  { age: 0, name: "nonexistent" },
  { age: 1, name: "barely vertical" },
  { age: 2, name: "snack negotiator" },
  { age: 3, name: "drool diplomat" },
  { age: 4, name: "juice box cartel" },
  { age: 5, name: "kindergarten" },
  { age: 6, name: "nap hostage" },
  { age: 7, name: "losing two front teeth" },
  { age: 8, name: "recess politician" },
  { age: 9, name: "early-stage crisis" },
  { age: 10, name: "pokemon era" },
  { age: 11, name: "puberty buffering" },
  { age: 12, name: "middle-school" },
  { age: 13, name: "locker smell" },
  { age: 14, name: "teenage" },
  { age: 15, name: "high-school" },
  { age: 16, name: "fake-id curious" },
  { age: 17, name: "almost driving" },
  { age: 18, name: "college" },
  { age: 19, name: "dining hall maximalist" },
  { age: 20, name: "ramen economist" },
  { age: 21, name: "entry-level crisis" },
  { age: 22, name: "unemployed" },
  { age: 23, name: "first w-2" },
  { age: 24, name: "500-linkedin followers" },
  { age: 25, name: "quarterlife crisis" },
  { age: 26, name: "unc-level" },
  { age: 27, name: "skin-care budget" },
  { age: 28, name: "back-has-opinions" },
  { age: 29, name: "calendar invite veteran" },
  { age: 30, name: "thirty-threat" },
  { age: 31, name: "playlist is oldies" },
  { age: 32, name: "mortgage-curious" },
  { age: 33, name: "group-chat elder" },
  { age: 34, name: "office cake survivor" },
  { age: 35, name: "minivan contemplator" },
  { age: 36, name: "midlife crisis" },
  { age: 37, name: "remembers dial-up" },
  { age: 38, name: "knees have opinions" },
  { age: 39, name: "youth coach energy" },
  { age: 40, name: "hair-turning-gray" },
  { age: 42, name: "old as fck" },
  { age: 44, name: "disco was yesterday" },
  { age: 45, name: "whackamole" },
  { age: 47, name: "fine wine" },
  { age: 48, name: "early bird curious" },
  { age: 50, name: "roth-ira maxxing out" },
  { age: 52, name: "kids call you sir" },
  { age: 54, name: "volume too loud" },
  { age: 55, name: "nap ambassador" },
  { age: 57, name: "prescription collector" },
  { age: 58, name: "tv remote archaeologist" },
  { age: 60, name: "senior discount unlocked" },
  { age: 62, name: "storytime looping" },
  { age: 65, name: "teeth falling out" },
  { age: 68, name: "crossword speedrunner" },
  { age: 70, name: "weather app devotee" },
  { age: 72, name: "birdwatching unlocked" },
  { age: 74, name: "tea temperature critic" },
  { age: 75, name: "birthday cake fire hazard" },
  { age: 78, name: "living fossil" },
  { age: 80, name: "presidentially" },
  { age: 82, name: "mythical" },
  { age: 85, name: "museum plaque" },
  { age: 88, name: "birthday needs a hose" },
  { age: 90, name: "nearly fossilized" },
  { age: 92, name: "eldritch" },
  { age: 95, name: "geological" },
  { age: 98, name: "almost deleted from time" },
  { age: 100, name: "centurion of vibes" },
];

const byAge = new Map(
  VIBES.map((vibe, index) => [vibe.age, { level: index + 1, name: vibe.name }]),
);

function vibeLabel(level: number, name: string) {
  return `old level ${level}: ${name} old`;
}

export function vibeFor(age: number): string {
  const entry = byAge.get(age);
  if (entry) return vibeLabel(entry.level, entry.name);
  return `${age} years of vibes`;
}

export function vibeOptions(min: number, max: number) {
  return VIBES.filter((vibe) => vibe.age >= min && vibe.age <= max).map(
    (vibe) => ({
      value: vibe.age,
      label: vibeLabel(VIBES.indexOf(vibe) + 1, vibe.name),
    }),
  );
}
