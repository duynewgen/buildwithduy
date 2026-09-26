export function BirthdayWheelDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50">
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "8px solid #18181b",
          }}
        />
        <div
          className="size-16 rounded-full border-2 border-white shadow-sm transition duration-700 ease-out group-hover:rotate-[220deg]"
          style={{
            background:
              "conic-gradient(#673ab7 0 20%, #f59e0b 0 40%, #38bdf8 0 60%, #34d399 0 80%, #fb7185 0 100%)",
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </div>
  );
}
