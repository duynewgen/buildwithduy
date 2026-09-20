import type { MetadataRoute } from "next";
import { builds, buildHref } from "@/lib/builds";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const buildEntries: MetadataRoute.Sitemap = builds.map((build) => ({
    url: `${siteConfig.url}${buildHref(build)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...buildEntries,
  ];
}
