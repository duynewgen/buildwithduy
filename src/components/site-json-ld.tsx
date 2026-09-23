import { siteConfig } from "@/lib/site";

/** Organization + WebSite JSON-LD for Google search branding / logo. */
export function SiteJsonLd() {
  const logoUrl = new URL(siteConfig.logo.src, siteConfig.url).toString();
  const iconUrl = new URL("/icon.png", siteConfig.url).toString();

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.brand,
        alternateName: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          // Square mark for favicon-style SERP / knowledge panel branding.
          url: iconUrl,
          width: 512,
          height: 512,
        },
        image: logoUrl,
        sameAs: [
          siteConfig.github,
          siteConfig.tiktok,
          siteConfig.instagram,
          siteConfig.x,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
