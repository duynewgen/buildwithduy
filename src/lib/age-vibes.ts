/** Age 0–100 as cursed life-stage vibes (not numbers). */

const VIBES: string[] = [
  "nonexistent", // 0
  "exquisitely young", // 1
  "tremendously young", // 2
  "barely vertical", // 3
  "kindergarten-focused young", // 4
  "stubborn young", // 5
  "snack-negotiator young", // 6
  "early-stage crisis", // 7
  "losing teeth on purpose", // 8
  "recess politician", // 9
  "puberty loading", // 10
  "puberty hit", // 11
  "beginning of teen", // 12
  "middle-school young", // 13
  "locker-smell young", // 14
  "high-school young", // 15
  "fake-id curious", // 16
  "almost driving young", // 17
  "college-transition young", // 18
  "ramen economist", // 19
  "starting to feel old", // 20
  "unemployed-focused old", // 21
  "entry-level crisis", // 22
  "employed old", // 23
  "linkedin young", // 24
  "quarterlife crisis", // 25
  "unc-level", // 26
  "group-chat elder", // 27
  "back-hurts sometimes", // 28
  "skin-care budget old", // 29
  "thirty-threat", // 30
  "mortgage-curious", // 31
  "playlist is mostly oldies", // 32
  "office birthday cake old", // 33
  "knees have opinions", // 34
  "midlife pregame", // 35
  "midlife crisis", // 36
  "minivan contemplator", // 37
  "remembers dial-up", // 38
  "youth coach energy", // 39
  "old", // 40
  "old with a gym membership", // 41
  "old af", // 42
  "disco was yesterday", // 43
  "super old", // 44
  "whackamole old", // 45
  "chegvirone (wine) old", // 46
  "early bird special curious", // 47
  "newspaper crossword old", // 48
  "half-century preload", // 49
  "half-century crisis", // 50
  "kids call you sir", // 51
  "remote lost forever old", // 52
  "volume too loud old", // 53
  "nap ambassador", // 54
  "grandkid rehearsal", // 55
  "gardening lore old", // 56
  "prescription collector", // 57
  "tv remote archaeologist", // 58
  "almost retirement bait", // 59
  "senior discount unlocked", // 60
  "early bird special unlocked", // 61
  "storytime looping old", // 62
  "weather app devotee", // 63
  "hip replacement curious", // 64
  "retirement rehearsal", // 65
  "free museum day old", // 66
  "birdwatching unlocked", // 67
  "crossword speedrunner", // 68
  "grandparent lore dump", // 69
  "ancient", // 70
  "wisdom flex old", // 71
  "walks for fun old", // 72
  "tea temperature critic", // 73
  "remembers the war stories", // 74
  "museum exhibit adjacent", // 75
  "birthday cake is fire-hazard", // 76
  "time traveler vibes", // 77
  "living fossil (affectionate)", // 78
  "almost a century preload", // 79
  "octogenarian aura", // 80
  "legendary old", // 81
  "mythical old", // 82
  "historical figure old", // 83
  "carbon-dated old", // 84
  "encyclopedia old", // 85
  "museum plaque old", // 86
  "prehistoric (nice)", // 87
  "birthday is a wildfire", // 88
  "nearly fossilized", // 89
  "nonagenarian menace", // 90
  "time itself is tired", // 91
  "birthday needs a hose", // 92
  "eldritch old", // 93
  "geological old", // 94
  "primordial old", // 95
  "big bang adjacent", // 96
  "universe reboot pending", // 97
  "almost deleted from time", // 98
  "one candle left in stock", // 99
  "centurion of vibes", // 100
];

export function vibeFor(age: number): string {
  if (age >= 0 && age < VIBES.length) return VIBES[age]!;
  return `${age} years of vibes`;
}

export function vibeOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let age = min; age <= max; age += 1) {
    options.push({ value: age, label: vibeFor(age) });
  }
  return options;
}
