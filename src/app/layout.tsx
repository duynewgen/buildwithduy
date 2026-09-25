import type { Metadata, Viewport } from "next";
import { Rubik, Schoolbell } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteJsonLd } from "@/components/site-json-ld";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

const schoolbell = Schoolbell({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-schoolbell",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Keep layout height in step with the phone browser chrome and keyboard.
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteConfig.logo.src,
        width: siteConfig.logo.width,
        height: siteConfig.logo.height,
        alt: siteConfig.logo.alt,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.logo.src],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rubik.variable} ${schoolbell.variable}`}>
      <body className="min-h-dvh bg-white font-sans text-zinc-900 antialiased">
        <SiteJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
