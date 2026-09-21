import Link from "next/link";
import { BuildShortcut } from "@/components/build-shortcut";
import { Logo } from "@/components/logo";
import {
  buildCategories,
  buildsInCategory,
  categoryHref,
} from "@/lib/builds";
import { siteConfig } from "@/lib/site";

type CategoryDirectoryProps = {
  category: string;
};

const linkClassName =
  "font-display text-lg tracking-tight text-zinc-600 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-300 ease-out hover:text-zinc-900 hover:decoration-current";

const socialLinks = [
  { href: siteConfig.about, label: "about", hidden: true }, // temporarily hidden
  { href: siteConfig.github, label: "github" },
  { href: siteConfig.tiktok, label: "tiktok" },
  { href: siteConfig.instagram, label: "instagram", hidden: true }, // temporarily hidden
  { href: siteConfig.x, label: "x", hidden: true }, // temporarily hidden
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
        .map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {link.label}
          </a>
        ))}
    </nav>
  );
}

export function CategoryDirectory({ category }: CategoryDirectoryProps) {
  const categoryBuilds = buildsInCategory(category);
  const allCategories = buildCategories();

  return (
    <main className="flex min-h-dvh flex-col xl:grid xl:grid-cols-[clamp(13rem,18vw,17rem)_minmax(0,1fr)]">
      <aside
        className={[
          "relative flex flex-col border-zinc-200",
          "px-[clamp(1.25rem,4.5vw,3.5rem)] pt-[clamp(1.5rem,4vh,3.5rem)]",
          "max-xl:gap-6 max-xl:border-b max-xl:pb-6",
          "xl:sticky xl:top-0 xl:h-dvh xl:gap-0 xl:border-r xl:pb-[clamp(1.5rem,4vh,3.5rem)]",
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

        <hr className="my-8 hidden border-zinc-200 xl:block" />

        <SocialLinks className="mt-auto hidden flex-col gap-2 xl:flex" />
      </aside>

      <section
        className={[
          "flex-1",
          "px-[clamp(1.25rem,4.5vw,4rem)]",
          "py-[clamp(1.75rem,5vh,4rem)]",
          "xl:min-w-0",
        ].join(" ")}
      >
        {categoryBuilds.length === 0 ? (
          <p className="text-sm text-zinc-500">nothing here yet.</p>
        ) : (
          <ul
            className={[
              "grid gap-[clamp(1rem,2.5vw,1.5rem)]",
              "grid-cols-2",
              "sm:grid-cols-[repeat(auto-fill,minmax(12rem,14rem))]",
            ].join(" ")}
            aria-label={`${category} builds`}
          >
            {categoryBuilds.map((build) => (
              <li key={build.path}>
                <BuildShortcut build={build} />
              </li>
            ))}
          </ul>
        )}
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
