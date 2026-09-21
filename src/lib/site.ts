export const siteConfig = {
  name: "buildwithduy",
  brand: "build with duy",
  description: "build random stuff with duy :)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithduy.vercel.app",
  about: "https://duynewgen.com",
  github: "https://github.com/duynewgen/buildwithduy",
  tiktok: "https://www.tiktok.com/@duynewgen",
  instagram: "https://www.instagram.com/duynewgen",
  x: "https://x.com/duynewgen",
  logo: {
    src: "/brand/logo.png",
    alt: "build with duy",
    width: 898,
    height: 624,
  },
} as const;
