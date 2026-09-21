import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { BackPill } from "@/components/back-pill";
import { getReadmeMarkdown } from "@/lib/readme";

export const metadata: Metadata = {
  title: "readme.md",
  description: "about buildwithduy — straight from the repo readme.",
};

export default function ReadmePage() {
  const markdown = getReadmeMarkdown();

  return (
    <main className="relative flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 sm:left-10 lg:left-16">
        <BackPill href="/birthday" />
      </div>

      <article className="mx-auto w-full max-w-2xl pt-14 sm:pt-8">
        <p className="mb-8 font-sans text-sm tabular-nums tracking-wide text-zinc-400">
          readme.md
        </p>
        <div className="space-y-4 text-zinc-800">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="font-display text-3xl tracking-tight text-zinc-900 sm:text-4xl">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="pt-4 font-display text-2xl tracking-tight text-zinc-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="pt-3 font-display text-xl tracking-tight text-zinc-900">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base leading-relaxed text-zinc-700">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-medium text-zinc-900">{children}</strong>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-700">
                  {children}
                </ol>
              ),
              ul: ({ children }) => (
                <ul className="list-disc space-y-3 pl-5 text-base leading-relaxed text-zinc-700">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-900"
                >
                  {children}
                </a>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
