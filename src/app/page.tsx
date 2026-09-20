import Link from "next/link";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <main className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Logo priority size={220} />
        <h1 className="mt-8 font-display text-4xl tracking-tight text-zinc-900 sm:text-5xl">
          random builds by duy
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-zinc-600">
          a playground for experiments. first up: cursed birthday selection
          ideas.
        </p>
        <ul className="mt-10 space-y-3">
          <li className="border-b border-zinc-200 px-1 py-4 text-xl text-zinc-700">
            <Link href="/birthday" className="underline-offset-4 hover:underline">
              birthday slider
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
