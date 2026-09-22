"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { CREATOR_YEAR, type YearPickerProps } from "@/lib/creator";

type Step = "month" | "day" | "year";
type Phase = "aiming" | "falling" | "landed";

const ALL_STEPS: Step[] = ["month", "day", "year"];

type BoardLayout = {
  width: number;
  height: number;
  cakeR: number;
  pegR: number;
  slotH: number;
  topY: number;
  pegRows: number;
  pegRowGap: number;
  pegStartY: number;
};

const LAYOUT_NORMAL: BoardLayout = {
  width: 560,
  height: 440,
  cakeR: 10,
  pegR: 4.5,
  slotH: 52,
  topY: 28,
  pegRows: 9,
  pegRowGap: 34,
  pegStartY: 70,
};

/** Shorter board so creator modal fits without scrolling. */
const LAYOUT_CREATOR: BoardLayout = {
  width: 560,
  height: 268,
  cakeR: 9,
  pegR: 3.5,
  slotH: 36,
  topY: 20,
  pegRows: 5,
  pegRowGap: 28,
  pegStartY: 48,
};

const GRAVITY = 1600;
const PEG_BOUNCE = 0.72;
const WALL_BOUNCE = 0.65;
const FLOOR_FRICTION = 0.88;
const SETTLE_V = 55;
const MAX_YEAR_SLOTS = 31;

const pillButtonBase =
  "inline-flex min-w-24 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

type Peg = { x: number; y: number };
type Vec = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMonthOrDay(value: number | null) {
  if (value === null) return "--";
  return String(value).padStart(2, "0");
}

function formatYear(value: number | null) {
  if (value === null) return "----";
  return String(value).padStart(4, "0");
}

function slotValuesFor(step: Step, yearMin: number): number[] {
  if (step === "month") {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }
  if (step === "day") {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }
  const max = CREATOR_YEAR.max;
  const count = max - yearMin + 1;
  const nSlots = Math.min(count, MAX_YEAR_SLOTS);
  if (nSlots === count) {
    return Array.from({ length: count }, (_, i) => yearMin + i);
  }
  return Array.from({ length: nSlots }, (_, i) =>
    Math.round(yearMin + (i / (nSlots - 1)) * (max - yearMin)),
  );
}

function buildPegs(layout: BoardLayout): Peg[] {
  const pegs: Peg[] = [];
  for (let row = 0; row < layout.pegRows; row++) {
    const cols = row % 2 === 0 ? 9 : 10;
    const y = layout.pegStartY + row * layout.pegRowGap;
    const inset = layout.width / (cols + 1);
    for (let col = 0; col < cols; col++) {
      pegs.push({ x: inset * (col + 1), y });
    }
  }
  return pegs;
}

function slotIndexFromX(x: number, slotCount: number, width: number) {
  const slotW = width / slotCount;
  return clamp(Math.floor(x / slotW), 0, slotCount - 1);
}

function CakeBall({
  x,
  y,
  radius,
}: {
  x: number;
  y: number;
  radius: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={radius} fill="#fff7ed" stroke="#fdba74" strokeWidth={2} />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: radius > 9 ? 14 : 12, userSelect: "none" }}
      >
        🎂
      </text>
    </g>
  );
}

export function BirthdayPlinko({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const layout = yearOnly ? LAYOUT_CREATOR : LAYOUT_NORMAL;
  const pegs = buildPegs(layout);
  const boardBottom = layout.height - layout.slotH;
  const yearMin = minYear ?? CREATOR_YEAR.min;
  const steps = yearOnly ? (["year"] as Step[]) : ALL_STEPS;
  const [step, setStep] = useState<Step>(yearOnly ? "year" : "month");
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(initialYear ?? null);
  const [phase, setPhase] = useState<Phase>("aiming");
  const [dropX, setDropX] = useState(layout.width / 2);
  const [cake, setCake] = useState<Vec>({
    x: layout.width / 2,
    y: layout.topY,
  });
  const [dragging, setDragging] = useState(false);
  const [highlightSlot, setHighlightSlot] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const velocityRef = useRef<Vec>({ x: 0, y: 0 });
  const cakeRef = useRef(cake);
  const phaseRef = useRef(phase);
  const stepRef = useRef(step);
  const valuesRef = useRef<number[]>([]);
  const layoutRef = useRef(layout);
  const pegsRef = useRef(pegs);
  const boardBottomRef = useRef(boardBottom);
  const onYearChangeRef = useRef(onYearChange);
  onYearChangeRef.current = onYearChange;

  cakeRef.current = cake;
  phaseRef.current = phase;
  stepRef.current = step;
  layoutRef.current = layout;
  pegsRef.current = pegs;
  boardBottomRef.current = boardBottom;

  const values = slotValuesFor(step, yearMin);
  valuesRef.current = values;
  const slotCount = values.length;
  const slotW = layout.width / slotCount;
  const stepIndex = steps.indexOf(step);

  const lockValue = useEffectEvent((slot: number) => {
    const next = valuesRef.current[slot];
    if (next === undefined) return;
    const current = stepRef.current;
    if (current === "month") setMonth(next);
    else if (current === "day") setDay(next);
    else {
      setYear(next);
      onYearChangeRef.current?.(next);
    }
    setHighlightSlot(slot);
    setPhase("landed");
    velocityRef.current = { x: 0, y: 0 };
  });

  const resetAim = useCallback(() => {
    const { width, topY } = layoutRef.current;
    setPhase("aiming");
    setDropX(width / 2);
    setCake({ x: width / 2, y: topY });
    velocityRef.current = { x: 0, y: 0 };
    setDragging(false);
    setHighlightSlot(null);
  }, []);

  useEffect(() => {
    resetAim();
  }, [step, yearMin, yearOnly, resetAim]);

  useEffect(() => {
    if (phase !== "falling") return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const {
        width,
        cakeR,
        pegR,
      } = layoutRef.current;
      const floor = boardBottomRef.current;

      let { x: vx, y: vy } = velocityRef.current;
      vy += GRAVITY * dt;

      let x = cakeRef.current.x + vx * dt;
      let y = cakeRef.current.y + vy * dt;

      if (x - cakeR < 0) {
        x = cakeR;
        vx = Math.abs(vx) * WALL_BOUNCE;
      } else if (x + cakeR > width) {
        x = width - cakeR;
        vx = -Math.abs(vx) * WALL_BOUNCE;
      }

      for (const peg of pegsRef.current) {
        const dx = x - peg.x;
        const dy = y - peg.y;
        const dist = Math.hypot(dx, dy);
        const minDist = cakeR + pegR;
        if (dist > 0 && dist < minDist) {
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;
          x += nx * overlap;
          y += ny * overlap;
          const vn = vx * nx + vy * ny;
          if (vn < 0) {
            vx = (vx - 2 * vn * nx) * PEG_BOUNCE;
            vy = (vy - 2 * vn * ny) * PEG_BOUNCE;
            vx += nx * 40;
          }
        }
      }

      if (y + cakeR >= floor) {
        y = floor - cakeR;
        vy = -Math.abs(vy) * 0.35;
        vx *= FLOOR_FRICTION;

        if (Math.abs(vy) < SETTLE_V && Math.abs(vx) < SETTLE_V) {
          const slot = slotIndexFromX(x, valuesRef.current.length, width);
          setCake({ x, y });
          velocityRef.current = { x: 0, y: 0 };
          lockValue(slot);
          return;
        }
      }

      velocityRef.current = { x: vx, y: vy };
      setCake({ x, y });
      setHighlightSlot(
        slotIndexFromX(x, valuesRef.current.length, width),
      );
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, lockValue]);

  function pointerToDropX(clientX: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    const { width, cakeR } = layoutRef.current;
    if (!rect) return dropX;
    const x = ((clientX - rect.left) / rect.width) * width;
    return clamp(x, cakeR + 4, width - cakeR - 4);
  }

  function onPointerDown(event: React.PointerEvent<SVGSVGElement>) {
    if (phaseRef.current !== "aiming") return;
    const x = pointerToDropX(event.clientX);
    setDragging(true);
    setDropX(x);
    setCake({ x, y: layoutRef.current.topY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging || phaseRef.current !== "aiming") return;
    const x = pointerToDropX(event.clientX);
    setDropX(x);
    setCake({ x, y: layoutRef.current.topY });
  }

  function onPointerUp(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function dropCake() {
    if (phaseRef.current !== "aiming") return;
    velocityRef.current = {
      x: (Math.random() - 0.5) * 40,
      y: 40,
    };
    setCake({ x: dropX, y: layoutRef.current.topY });
    setPhase("falling");
  }

  const lockedValue =
    step === "month" ? month : step === "day" ? day : year;
  const previewSlot =
    highlightSlot ??
    slotIndexFromX(cake.x, slotCount, layout.width);
  const liveValue =
    phase === "falling" || phase === "aiming"
      ? values[previewSlot]
      : lockedValue;

  const status =
    phase === "aiming"
      ? yearOnly
        ? "aim, then drop."
        : "drag left or right to aim, then drop the cake."
      : phase === "falling"
        ? "falling..."
        : yearOnly
          ? "landed. drop again anytime."
          : "landed. drop again or continue.";

  const labelEvery =
    slotCount <= 12 ? 1 : slotCount <= 20 ? 2 : slotCount <= 31 ? 5 : 10;

  return (
    <div className="w-full text-center">
      <p
        className={[
          "font-sans tabular-nums tracking-wide text-zinc-900",
          yearOnly ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl",
        ].join(" ")}
      >
        {yearOnly
          ? formatYear(liveValue ?? null)
          : `${formatMonthOrDay(step === "month" ? (liveValue ?? month) : month)} / ${formatMonthOrDay(step === "day" ? (liveValue ?? day) : day)} / ${formatYear(step === "year" ? (liveValue ?? year) : year)}`}
      </p>

      <div
        className={[
          "text-left",
          yearOnly ? "mt-3 space-y-2" : "mt-8 space-y-3",
        ].join(" ")}
      >
        {yearOnly ? null : (
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm tracking-wide text-zinc-500">{step}</span>
            <span className="font-sans text-2xl tabular-nums text-zinc-900">
              {liveValue !== undefined && liveValue !== null
                ? step === "year"
                  ? formatYear(liveValue)
                  : formatMonthOrDay(liveValue)
                : "—"}
            </span>
          </div>
        )}

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className={[
              "h-auto w-full touch-none select-none rounded-2xl border border-zinc-200 bg-[#f7f4ef]",
              phase === "aiming" ? "cursor-ew-resize" : "",
              dragging ? "cursor-grabbing" : "",
            ].join(" ")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="img"
            aria-label={`plinko board for ${step}. drag to aim, then drop.`}
          >
            <rect
              x={0}
              y={0}
              width={layout.width}
              height={layout.height}
              fill="#f7f4ef"
            />

            <rect
              x={12}
              y={layout.topY - 8}
              width={layout.width - 24}
              height={5}
              rx={3}
              fill="#d6c7a8"
            />

            {pegs.map((peg, index) => (
              <circle
                key={`peg-${index}`}
                cx={peg.x}
                cy={peg.y}
                r={layout.pegR}
                fill="#5b3a1a"
              />
            ))}

            {values.map((value, index) => {
              const x = index * slotW;
              const active = previewSlot === index;
              const showLabel =
                index % labelEvery === 0 || index === values.length - 1;
              return (
                <g key={`slot-${value}-${index}`}>
                  <rect
                    x={x}
                    y={boardBottom}
                    width={slotW}
                    height={layout.slotH}
                    fill={
                      active
                        ? "#fde68a"
                        : index % 2 === 0
                          ? "#efe6d6"
                          : "#e7dcc8"
                    }
                    stroke="#c4b59a"
                    strokeWidth={1}
                  />
                  {showLabel ? (
                    <text
                      x={x + slotW / 2}
                      y={boardBottom + layout.slotH / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-zinc-700"
                      style={{
                        fontSize: slotCount > 20 ? 8 : 11,
                        fontFamily: "var(--font-rubik), Rubik, sans-serif",
                      }}
                    >
                      {step === "year" ? String(value).slice(2) : value}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {values.map((_, index) =>
              index === 0 ? null : (
                <line
                  key={`div-${index}`}
                  x1={index * slotW}
                  y1={boardBottom - 14}
                  x2={index * slotW}
                  y2={boardBottom}
                  stroke="#8a7a5c"
                  strokeWidth={2}
                />
              ),
            )}

            {phase === "aiming" ? (
              <line
                x1={dropX}
                y1={layout.topY + 6}
                x2={dropX}
                y2={layout.topY + 22}
                stroke="#a1a1aa"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            ) : null}

            <CakeBall x={cake.x} y={cake.y} radius={layout.cakeR} />
          </svg>

          {phase === "landed" ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={resetAim}
                className={`${pillButtonBase} pointer-events-auto border-zinc-300 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-sm hover:border-zinc-900`}
              >
                drop again
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-center gap-3">
          {phase === "aiming" ? (
            <button
              type="button"
              onClick={dropCake}
              className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800`}
            >
              drop
            </button>
          ) : null}
        </div>

        <p className="text-center text-sm text-zinc-500">{status}</p>
      </div>

      {yearOnly ? null : (
        <>
          <div className="mt-8 flex min-h-10 flex-wrap items-center justify-center gap-3">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStep(steps[stepIndex - 1])}
                className={`${pillButtonBase} border-zinc-900 bg-transparent text-zinc-900 hover:bg-zinc-100`}
              >
                previous
              </button>
            ) : null}
            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(steps[stepIndex + 1])}
                disabled={phase === "falling" || lockedValue === null}
                className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 disabled:cursor-default disabled:opacity-40`}
              >
                next
              </button>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            step {stepIndex + 1} of {steps.length}: {step}
          </p>
        </>
      )}
    </div>
  );
}
