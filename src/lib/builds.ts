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
    title: "birthday slider",
    description: "slide to your month, day, and year. be careful with decimals.",
  },
];

export function buildHref(build: Build) {
  return `/${build.path}`;
}
