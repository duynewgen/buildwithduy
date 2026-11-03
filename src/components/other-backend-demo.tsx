export function OtherBackendDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-emerald-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/other/backend-garden.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <svg viewBox="0 0 220 90" className="relative z-10 h-[78%] w-[92%]">
        <defs>
          <linearGradient id="backend-e" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="40%" stopColor="#fdba74" />
            <stop offset="75%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
        </defs>
        <g transform="translate(220 0) scale(-1 1)">
          <text
            x="110"
            y="68"
            textAnchor="middle"
            fontFamily="Rubik, sans-serif"
            fontWeight="900"
            fontSize="72"
            fill="#ffffff"
            stroke="#18181b"
            strokeWidth="3"
          >
            END
          </text>
          <text
            x="58"
            y="68"
            textAnchor="middle"
            fontFamily="Rubik, sans-serif"
            fontWeight="900"
            fontSize="72"
            fill="url(#backend-e)"
            stroke="#18181b"
            strokeWidth="3"
            className="transition-[filter] duration-200 group-hover:brightness-110"
          >
            E
          </text>
        </g>
      </svg>
    </div>
  );
}
