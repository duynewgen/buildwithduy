export type Build = {
  /** path under site root, e.g. "birthday/slider" */
  path: string;
  title: string;
  description: string;
};

export type Category = {
  id: string;
  description: string;
  /** temporarily omit from sidebar + sitemap */
  hidden?: boolean;
};

/**
 * Categories shown in the sidebar, in order.
 * Empty categories are fine — they still get a directory page for UI testing.
 */
export const categories: Category[] = [
  {
    id: "birthday",
    description: "cursed birthday selection builds.",
  },
  {
    id: "payment",
    description: "cursed payment builds.",
  },
  {
    id: "authentication",
    description: "cursed authentication builds.",
  },
  {
    id: "other",
    description: "other cursed builds.",
  },
];

/**
 * Registry of every public build. Homepage + sitemap read from this.
 * When adding a build: add a route at `src/app/{path}/page.tsx` AND an entry here.
 */
export const builds: Build[] = [
  {
    path: "birthday/slider",
    title: "slider",
    description: "slide to your month, day, and year.",
  },
  {
    path: "birthday/angry-cake",
    title: "angry cake",
    description: "fling a cake to land on your month, day, and year.",
  },
  {
    path: "birthday/lottery",
    title: "lottery",
    description: "pull each handle to roll your month, day, and year.",
  },
  {
    path: "birthday/words",
    title: "words",
    description: "pick your month, day, and year in words.",
  },
  {
    path: "birthday/roman",
    title: "roman",
    description: "pick your month, day, and year in roman numerals.",
  },
  {
    path: "birthday/bounce",
    title: "bounce",
    description: "bounce a cake off the walls to count your month and day.",
  },
  {
    path: "birthday/click",
    title: "click",
    description:
      "mash the box for 5 seconds to set your month, day, and year.",
  },
  {
    path: "birthday/drop-the-cake",
    title: "drop the cake",
    description: "drop a cake through the pegs onto your month, day, and year.",
  },
  {
    path: "birthday/math",
    title: "math",
    description: "pick your month, day, and year as cursed formulas.",
  },
  {
    path: "payment/apple-pay",
    title: "apple pay",
    description: "pay by catching falling apples. each apple is $1.",
  },
  {
    path: "payment/no-tip",
    title: "no tip",
    description: "skip the tip. unlock a subscription.",
  },
  {
    path: "payment/card",
    title: "card",
    description: "pay with card. flip poker cards until you hit the total.",
  },
  {
    path: "payment/cancel",
    title: "cancel",
    description: "cancel your subscription. pay to leave.",
  },
  {
    path: "payment/cancel-2",
    title: "cancel, part 2",
    description: "cancel again. survive the confirmation gauntlet.",
  },
  {
    path: "payment/split",
    title: "split",
    description: "split the check. literally.",
  },
  {
    path: "authentication/two-factor",
    title: "two-factor",
    description: "sign in. verify with two factors.",
  },
  {
    path: "authentication/two-factor-2",
    title: "two-factor, part 2",
    description: "sign in. verify with conversion factors.",
  },
  {
    path: "authentication/otp-hint",
    title: "otp hint",
    description: "verify with otp. the hint is right there.",
  },
  {
    path: "authentication/rotary-phone",
    title: "rotary phone",
    description: "verify with otp. dial any six digits.",
  },
  {
    path: "authentication/falling-numbers",
    title: "falling numbers",
    description: "verify with otp. catch any six digits.",
  },
  {
    path: "authentication/snake",
    title: "snake",
    description: "verify with otp. eat six numbered balls.",
  },
];

export function buildHref(build: Build) {
  return `/${build.path}`;
}

export function buildCategory(build: Build) {
  return build.path.split("/")[0] ?? build.path;
}

export function categoryHref(category: string) {
  return `/${category}`;
}

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}

/** visible category ids in sidebar order */
export function buildCategories() {
  return categories
    .filter((category) => !category.hidden)
    .map((category) => category.id);
}

export function buildsInCategory(category: string) {
  return builds.filter((build) => buildCategory(build) === category);
}

export function getBuildByPath(path: string) {
  return builds.find((build) => build.path === path);
}
