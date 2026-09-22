import Link from "next/link";
import type { ReactNode } from "react";
import { BuildShortcut } from "@/components/build-shortcut";
import { Logo } from "@/components/logo";
import {
  buildCategories,
  buildsInCategory,
  categoryHref,
} from "@/lib/builds";
import { siteConfig } from "@/lib/site";

type CategoryShellProps = {
  category: string;
  children: ReactNode;
};

const linkClassName =
  "font-display text-lg tracking-tight text-zinc-600 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-300 ease-out hover:text-zinc-900 hover:decoration-current";

const socialLinks = [
  { href: "/readme", label: "readme.md", external: false },
  { href: siteConfig.about, label: "about", hidden: true, external: true }, // temporarily hidden
  { href: siteConfig.github, label: "github", external: true },
  { href: siteConfig.tiktok, label: "tiktok", external: true },
  {
    href: siteConfig.instagram,
    label: "instagram",
    hidden: true,
    external: true,
  }, // temporarily hidden
  { href: siteConfig.x, label: "x", hidden: true, external: true }, // temporarily hidden
];

function SocialLinks({
  className,
  linkClass = linkClassName,
}: {
  className?: string;
  linkClass?: string;
}) {
  return (
    <nav className={className} aria-label="links">
      {socialLinks
        .filter((link) => !link.hidden)
        .map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ),
        )}
    </nav>
  );
}

/** Persistent directory chrome (logo, categories, social). Main content is `children`. */
export function CategoryShell({ category, children }: CategoryShellProps) {
  const allCategories = buildCategories();

  return (
    <main className="flex min-h-dvh flex-col xl:grid xl:grid-cols-[clamp(13rem,18vw,17rem)_minmax(0,1fr)]">
      <aside
        className={[
          "relative flex flex-col border-zinc-200",
          "px-[clamp(1.25rem,4.5vw,3.5rem)] pt-[clamp(1.5rem,4vh,3.5rem)]",
          "max-xl:gap-6 max-xl:border-b max-xl:pb-6",
          "xl:sticky xl:top-0 xl:h-dvh xl:gap-0 xl:border-r xl:pb-0",
        ].join(" ")}
      >
        <div className="w-[clamp(4.25rem,18vw,6rem)] shrink-0">
          <Logo priority size={96} />
        </div>

        <nav
          className={[
            "flex snap-x snap-mandatory gap-5 overflow-x-auto",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "max-xl:-mx-[clamp(1.25rem,4.5vw,3.5rem)] max-xl:px-[clamp(1.25rem,4.5vw,3.5rem)]",
            "xl:mt-8 xl:flex-col xl:gap-2 xl:overflow-visible xl:px-0",
          ].join(" ")}
          aria-label="categories"
        >
          {allCategories.map((id) => {
            const isCurrent = id === category;
            return (
              <Link
                key={id}
                href={categoryHref(id)}
                aria-current={isCurrent ? "page" : undefined}
                className={[
                  "shrink-0 snap-start",
                  isCurrent
                    ? "font-display text-lg tracking-tight text-zinc-900"
                    : linkClassName,
                ].join(" ")}
              >
                {id}
              </Link>
            );
          })}
        </nav>

        <div
          className={[
            "mt-auto hidden xl:block",
            "-mx-[clamp(1.25rem,4.5vw,3.5rem)]",
            "border-t border-zinc-200",
            "px-[clamp(1.25rem,4.5vw,3.5rem)]",
            "py-[clamp(1.25rem,3vh,2rem)]",
          ].join(" ")}
        >
          <SocialLinks className="flex flex-col gap-2" />
        </div>
      </aside>

      <section
        className={[
          "flex-1",
          "px-[clamp(1.25rem,4.5vw,4rem)]",
          "py-[clamp(1.75rem,5vh,4rem)]",
          "xl:min-w-0",
        ].join(" ")}
      >
        {children}
      </section>

      <footer
        className={[
          "mt-auto px-[clamp(1.25rem,4.5vw,4rem)] pb-[clamp(1.5rem,4vh,3rem)] pt-2",
          "xl:hidden",
        ].join(" ")}
      >
        <SocialLinks
          className="flex flex-wrap justify-end gap-x-3 gap-y-1"
          linkClass="font-display text-base tracking-tight text-zinc-600 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-300 ease-out hover:text-zinc-900 hover:decoration-current"
        />
      </footer>
    </main>
  );
}

export function CategoryBuilds({ category }: { category: string }) {
  const categoryBuilds = buildsInCategory(category);

  if (categoryBuilds.length === 0) {
    return <p className="text-sm text-zinc-500">coming soon :)</p>;
  }

  return (
    <div>
      <ul
        className={[
          "grid gap-[clamp(1rem,2.5vw,1.5rem)]",
          "grid-cols-2",
          "sm:grid-cols-[repeat(auto-fill,minmax(12rem,14rem))]",
        ].join(" ")}
        aria-label={`${category} builds`}
      >
        {categoryBuilds.map((build) => (
          <li key={build.path} className="h-full">
            <BuildShortcut build={build} />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-zinc-500">more coming soon</p>
    </div>
  );
}

export function CategoryDirectory({ category }: { category: string }) {
  return (
    <CategoryShell category={category}>
      <CategoryBuilds category={category} />
    </CategoryShell>
  );
}
