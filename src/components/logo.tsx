import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

type LogoProps = {
  className?: string;
  priority?: boolean;
  size?: number;
  href?: string | false;
};

export function Logo({
  className = "",
  priority = false,
  size = 160,
  href = "/",
}: LogoProps) {
  const image = (
    <Image
      src={siteConfig.logo.src}
      alt={siteConfig.logo.alt}
      width={siteConfig.logo.width}
      height={siteConfig.logo.height}
      priority={priority}
      className={`h-auto w-full ${className}`.trim()}
      style={{ maxWidth: size }}
    />
  );

  if (href === false) {
    return image;
  }

  return (
    <Link href={href} className="inline-block" aria-label={siteConfig.brand}>
      {image}
    </Link>
  );
}
