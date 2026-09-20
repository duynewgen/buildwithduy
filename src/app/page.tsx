export default function Home() {
  return (
    <main className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
          buildwithduy
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
          random builds by duy
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          A playground for experiments. First up: cursed birthday selection
          ideas.
        </p>
        <ul className="mt-10 space-y-3">
          <li className="border-b border-zinc-200 px-1 py-4 text-zinc-700">
            cursed birthday selection ideas — coming soon
          </li>
        </ul>
      </div>
    </main>
  );
}
