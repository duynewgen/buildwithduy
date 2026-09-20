export const siteConfig = {
  name: "buildwithduy",
  brand: "build with duy",
  description: "build random stuff with duy :)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithduy.vercel.app",
  logo: {
    src: "/brand/logo.png",
    alt: "build with duy",
    width: 1024,
    height: 1024,
  },
} as const;
