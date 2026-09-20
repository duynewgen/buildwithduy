import type { MetadataRoute } from "next";
import {
  buildCategories,
  buildHref,
  builds,
  categoryHref,
} from "@/lib/builds";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryEntries: MetadataRoute.Sitemap = buildCategories().map(
    (category) => ({
      url: `${siteConfig.url}${categoryHref(category)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }),
  );

  const buildEntries: MetadataRoute.Sitemap = builds.map((build) => ({
    url: `${siteConfig.url}${buildHref(build)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categoryEntries,
    ...buildEntries,
  ];
}
