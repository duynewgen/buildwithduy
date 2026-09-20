export default function Home() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
          buildwithduy
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          random builds by duy
        </h1>
        <p className="mt-4 text-zinc-400">
          A playground for experiments. First up: cursed birthday selection
          ideas.
        </p>
        <ul className="mt-10 space-y-3">
          <li className="rounded-lg border border-zinc-800 px-4 py-3 text-zinc-300">
            cursed birthday selection ideas — coming soon
          </li>
        </ul>
      </div>
    </main>
  );
}
