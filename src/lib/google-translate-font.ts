import localFont from "next/font/local";

export const googleSans = localFont({
  src: "../fonts/google-sans-latin.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});
