function formatToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = String(now.getFullYear()).padStart(4, "0");
  return `${month} / ${day} / ${year}`;
}

export function BirthdayAngryCakeDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#f7f4ef] px-3">
      <svg
        viewBox="0 0 160 72"
        className="h-16 w-full max-w-[10rem]"
        aria-hidden
      >
        <rect x="0" y="58" width="160" height="14" fill="#d6c7a8" />
        <line
          x1="28"
          y1="58"
          x2="148"
          y2="58"
          stroke="#a89878"
          strokeWidth="2.5"
        />
        <line
          x1="120"
          y1="58"
          x2="120"
          y2="64"
          stroke="#8a7a5c"
          strokeWidth="2"
        />

        <line
          x1="18"
          y1="58"
          x2="22"
          y2="36"
          stroke="#5b3a1a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="34"
          y1="58"
          x2="30"
          y2="36"
          stroke="#5b3a1a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="36"
          x2="30"
          y2="36"
          stroke="#3f3f46"
          strokeWidth="2"
        />

        <path
          d="M 26 34 Q 70 6 118 48"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeLinecap="round"
          className="opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        />
        <circle
          cx="48"
          cy="18"
          r="1.6"
          fill="#a1a1aa"
          className="opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100"
        />
        <circle
          cx="72"
          cy="12"
          r="1.6"
          fill="#a1a1aa"
          className="opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100"
        />
        <circle
          cx="96"
          cy="18"
          r="1.6"
          fill="#a1a1aa"
          className="opacity-0 transition-opacity delay-200 duration-300 group-hover:opacity-100"
        />

        <text
          x="26"
          y="38"
          textAnchor="middle"
          className="group-hover:animate-cake-fly"
          style={{ fontSize: 18 }}
        >
          🎂
        </text>
      </svg>
      <p
        suppressHydrationWarning
        className="font-sans text-sm tabular-nums text-zinc-700"
      >
        {formatToday()}
      </p>
    </div>
  );
}
