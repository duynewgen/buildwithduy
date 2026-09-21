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
    id: "password",
    description: "password builds.",
    hidden: true,
  },
  {
    id: "2fa",
    description: "two-factor builds.",
    hidden: true,
  },
  {
    id: "other",
    description: "other builds.",
    hidden: true,
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
