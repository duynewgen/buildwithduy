const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

export function OtherBackendDemo() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white" style={scrappyFont}>
      <div className="flex h-full w-full flex-col items-center justify-center px-2 transition-opacity duration-200 group-hover:opacity-0">
        <p className="text-center text-[9px] leading-tight text-red-700">
          Backend design
          <br />
          assignment
        </p>
        <div className="mt-1 flex h-10 w-8 items-end justify-center border border-orange-600 bg-white pb-1">
          <span className="rounded-[2px] bg-rose-600 px-0.5 text-[6px] font-bold text-white">
            PDF
          </span>
        </div>
        <p className="mt-1 rounded-full border border-red-900 bg-red-600 px-2 py-0.5 text-[7px] text-white">
          Open submission
        </p>
      </div>
      <div className="absolute inset-0 flex flex-col bg-[#c0c0c0] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="bg-[#000080] px-1 py-0.5 text-[7px] font-bold text-white">
          backend - Paint
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
          <svg viewBox="0 0 240 100" className="h-full w-full">
            <defs>
              <pattern
                id="backend-d"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(18)"
              >
                <circle cx="6" cy="8" r="7" fill="#f97316" />
                <circle cx="18" cy="4" r="5" fill="#16a34a" />
                <circle cx="14" cy="20" r="8" fill="#7c3aed" />
              </pattern>
              <pattern
                id="backend-n"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-12)"
              >
                <circle cx="8" cy="8" r="7" fill="#da291c" />
                <circle cx="20" cy="14" r="6" fill="#f97316" />
                <circle cx="10" cy="22" r="5" fill="#facc15" />
              </pattern>
              <pattern
                id="backend-e"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-24)"
              >
                <circle cx="8" cy="10" r="8" fill="#16a34a" />
                <circle cx="22" cy="6" r="6" fill="#2563eb" />
                <circle cx="16" cy="22" r="7" fill="#7c3aed" />
              </pattern>
            </defs>
            <g transform="translate(214 -4) scale(-1 1)">
              <text
                x="110"
                y="68"
                textAnchor="middle"
                fontFamily="Rubik, sans-serif"
                fontWeight="900"
                fontSize="68"
                fill="#3f3f46"
              >
                END
              </text>
            </g>
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
    </div>
  );
}
