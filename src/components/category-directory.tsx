import { BuildShortcut } from "@/components/build-shortcut";
import { Logo } from "@/components/logo";
import { buildsInCategory } from "@/lib/builds";
import { siteConfig } from "@/lib/site";

type CategoryDirectoryProps = {
  category: string;
};

export function CategoryDirectory({ category }: CategoryDirectoryProps) {
  const categoryBuilds = buildsInCategory(category);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(14rem,18rem)_1fr]">
      <section className="flex flex-col border-b border-zinc-200 px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-16">
        <Logo priority size={96} />
        <h1 className="mt-6 font-sans text-lg text-zinc-900">{category}</h1>

        <hr className="my-8 border-zinc-200" />

        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          github
        </a>
      </section>

      <section className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fill,minmax(12rem,14rem))]"
          aria-label={`${category} builds`}
        >
          {categoryBuilds.map((build) => (
            <li key={build.path}>
              <BuildShortcut build={build} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
