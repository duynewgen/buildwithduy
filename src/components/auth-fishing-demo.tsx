export function AuthFishingDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sky-300">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-300 to-sky-600" />

      {/* rod swings left → right on hover */}
      <div
        className="absolute top-1 left-[22%] h-[42%] w-px bg-zinc-800/55 transition-all duration-700 ease-in-out group-hover:left-[72%] group-hover:h-[62%]"
      />
      <div className="absolute top-[42%] left-[22%] size-1.5 -translate-x-1/2 rounded-full border border-zinc-800 bg-zinc-100 transition-all duration-700 ease-in-out group-hover:left-[72%] group-hover:top-[62%]" />

      {/* fish drifts toward the dropped hook */}
      <div className="absolute left-[58%] top-[58%] h-5 w-8 transition-all duration-700 ease-in-out group-hover:left-[70%] group-hover:top-[60%] group-hover:opacity-30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/authentication/fish.svg"
          alt=""
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>

      <p className="absolute bottom-1.5 rounded-full bg-zinc-900/80 px-2 py-0.5 font-sans text-[7px] text-white opacity-0 transition duration-500 group-hover:opacity-100">
        throw
      </p>
    </div>
  );
}
