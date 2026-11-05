const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherBackendDemo() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white" style={scrappyFont}>
      <div className="flex h-full w-full flex-col items-center justify-center px-2 transition-opacity duration-200 group-hover:opacity-0">
        <p className="text-center text-[9px] leading-tight text-red-700">
          Agentic Backend
          <br />
          Design
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/other/backend-preview.png"
          alt=""
          className="mt-1 h-9 w-9 border border-orange-600 object-contain"
        />
        <p className="mt-1 rounded-full border border-red-900 bg-red-600 px-2 py-0.5 text-[7px] text-white">
          Run backend
        </p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <svg viewBox="0 0 240 100" className="h-[78%] w-[92%]">
          <defs>
            <pattern
              id="backend-d"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="8" cy="10" r="6" fill="#f97316" />
              <circle cx="18" cy="8" r="4" fill="#facc15" />
              <circle cx="14" cy="20" r="5" fill="#16a34a" />
            </pattern>
            <pattern
              id="backend-n"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="8" r="6" fill="#7c3aed" />
              <circle cx="18" cy="16" r="5" fill="#2563eb" />
              <circle cx="8" cy="20" r="4" fill="#da291c" />
            </pattern>
            <pattern
              id="backend-e"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="8" r="6" fill="#da291c" />
              <circle cx="18" cy="14" r="5" fill="#f97316" />
              <circle cx="8" cy="20" r="4" fill="#16a34a" />
            </pattern>
          </defs>
          <g transform="translate(220 0) scale(-1 1)">
            <text
              x="110"
              y="68"
              textAnchor="middle"
              fontFamily="Rubik, sans-serif"
              fontWeight="900"
              fontSize="68"
              fill="#ffffff"
              stroke="#18181b"
              strokeWidth="3"
            >
              END
            </text>
            <text
              x="162"
              y="68"
              textAnchor="middle"
              fontFamily="Rubik, sans-serif"
              fontWeight="900"
              fontSize="68"
              fill="url(#backend-d)"
              stroke="#18181b"
              strokeWidth="3"
            >
              D
            </text>
            <text
              x="110"
              y="68"
              textAnchor="middle"
              fontFamily="Rubik, sans-serif"
              fontWeight="900"
              fontSize="68"
              fill="url(#backend-n)"
              stroke="#18181b"
              strokeWidth="3"
            >
              N
            </text>
            <text
              x="58"
              y="68"
              textAnchor="middle"
              fontFamily="Rubik, sans-serif"
              fontWeight="900"
              fontSize="68"
              fill="url(#backend-e)"
              stroke="#18181b"
              strokeWidth="3"
            >
              E
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
