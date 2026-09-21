import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  /** path relative to site root, e.g. "/birthday/slider" or "/" */
  path: string;
};

/** Shared title / description / canonical / OG / Twitter for public pages. */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const ogTitle =
    title === siteConfig.name ? title : `${title} - ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
    },
  };
}
