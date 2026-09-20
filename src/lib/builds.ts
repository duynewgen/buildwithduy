export type Build = {
  /** path under site root, e.g. "birthday/slider" */
  path: string;
  title: string;
  description: string;
};

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

/** unique categories in registry order */
export function buildCategories() {
  const seen = new Set<string>();
  const categories: string[] = [];
  for (const build of builds) {
    const category = buildCategory(build);
    if (!seen.has(category)) {
      seen.add(category);
      categories.push(category);
    }
  }
  return categories;
}

export function buildsInCategory(category: string) {
  return builds.filter((build) => buildCategory(build) === category);
}

export function getBuildByPath(path: string) {
  return builds.find((build) => build.path === path);
}
