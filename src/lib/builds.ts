export type Build = {
  /** path under site root, e.g. "form/slider" */
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
    id: "form",
    description: "cursed form builds.",
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
export type FormPrompt = "born" | "age";

export type FormExperiment = {
  slug: string;
  title: string;
  description: string;
  prompt: FormPrompt;
  inline?: boolean;
};

/** Shared form builds. The interest form uses the google form layout. */
export const formExperiments: FormExperiment[] = [
  {
    slug: "slider",
    title: "slider",
    description: "slide to your birth year.",
    prompt: "born",
  },
  {
    slug: "angry-cake",
    title: "angry cake",
    description: "fling a cake to land on your birth year.",
    prompt: "born",
  },
  {
    slug: "lottery",
    title: "lottery",
    description: "pull the handle to roll your birth year.",
    prompt: "born",
  },
  {
    slug: "words",
    title: "words",
    description: "pick your birth year in words.",
    prompt: "born",
    inline: true,
  },
  {
    slug: "roman",
    title: "roman",
    description: "pick your birth year in roman numerals.",
    prompt: "born",
    inline: true,
  },
  {
    slug: "arabic",
    title: "arabic",
    description: "pick your birth year in arabic words.",
    prompt: "born",
    inline: true,
  },
  {
    slug: "chinese",
    title: "chinese",
    description: "pick your birth year in chinese.",
    prompt: "born",
    inline: true,
  },
  {
    slug: "math",
    title: "math",
    description: "pick your age as a cursed formula.",
    prompt: "age",
    inline: true,
  },
  {
    slug: "chemistry",
    title: "chemistry",
    description: "pick your age as a chemical formula.",
    prompt: "age",
    inline: true,
  },
  {
    slug: "binary",
    title: "binary",
    description: "pick your age in binary.",
    prompt: "age",
    inline: true,
  },
  {
    slug: "morse",
    title: "morse",
    description: "pick your age in morse.",
    prompt: "age",
    inline: true,
  },
  {
    slug: "random-orders",
    title: "random orders",
    description: "pick your age from a shuffled list.",
    prompt: "age",
    inline: true,
  },
  {
    slug: "wheel-of-fortune",
    title: "wheel of fortune",
    description: "spin the wheel to land on your age.",
    prompt: "age",
  },
  {
    slug: "bounce",
    title: "bounce",
    description: "bounce a cake off the walls to count your age.",
    prompt: "age",
  },
  {
    slug: "click",
    title: "click",
    description: "mash the box for 3 seconds to set your age.",
    prompt: "age",
  },
  {
    slug: "drop-the-cake",
    title: "drop the cake",
    description: "drop a cake through the pegs onto your age.",
    prompt: "age",
  },
];

export const formSlugs = formExperiments.map((build) => build.slug);

export const builds: Build[] = [
  ...formExperiments.map((build) => ({
    path: `form/${build.slug}`,
    title: build.title,
    description: build.description,
  })),
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
  {
    path: "authentication/pay-to-prove",
    title: "pay to prove",
    description: "verify your account. subscribe to stay human.",
  },
  {
    path: "authentication/fishing",
    title: "fishing",
    description: "verify with otp. aim, throw, catch four numbered fish.",
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
