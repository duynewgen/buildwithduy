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
type Phase = "aiming" | "flying" | "landed";

const ALL_STEPS: Step[] = ["month", "day", "year"];

const RANGES = {
  month: { min: 1, max: 12, step: 1 },
  day: { min: 1, max: 31, step: 1 },
  year: { min: 1900, max: 2026, step: 1 },
} as const;

const WIDTH = 820;
const HEIGHT = 300;
const GROUND_Y = 250;
const ANCHOR = { x: 78, y: 205 };
const CAKE_R = 16;
const MAX_PULL = 92;
const GRAVITY = 900;
const LAUNCH_SCALE = 11.2;
const FIELD_LEFT = 130;
const FIELD_RIGHT = 790;
const GROUND_BOUNCE = 0.58;
const WALL_BOUNCE = 0.72;
const GROUND_FRICTION = 0.82;
const SETTLE_VY = 55;
const SETTLE_VX = 35;

function snapToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMonthOrDay(value: number) {
  return String(Math.round(value)).padStart(2, "0");
}

function formatYear(value: number) {
  return String(Math.round(value)).padStart(4, "0");
}

type FieldRange = { min: number; max: number; step: number };

function xToValue(x: number, range: FieldRange) {
  const t = clamp((x - FIELD_LEFT) / (FIELD_RIGHT - FIELD_LEFT), 0, 1);
  const raw = range.min + t * (range.max - range.min);
  return clamp(snapToStep(raw, range.step), range.min, range.max);
}

function valueToX(value: number, range: FieldRange) {
  const span = range.max - range.min;
  const t = span === 0 ? 0 : (value - range.min) / span;
  return FIELD_LEFT + t * (FIELD_RIGHT - FIELD_LEFT);
}

function pullFromPointer(clientX: number, clientY: number, rect: DOMRect) {
  const x = ((clientX - rect.left) / rect.width) * WIDTH;
  const y = ((clientY - rect.top) / rect.height) * HEIGHT;
  const dx = x - ANCHOR.x;
  const dy = y - ANCHOR.y;
  const dist = Math.hypot(dx, dy);
  const limited = Math.min(dist, MAX_PULL);
  const angle = Math.atan2(dy, dx);
  return {
    x: ANCHOR.x + Math.cos(angle) * limited,
    y: ANCHOR.y + Math.sin(angle) * limited,
  };
}

function CakeBall({
  x,
  y,
  interactive = false,
}: {
  x: number;
  y: number;
  interactive?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      className={interactive ? "cursor-pointer" : undefined}
      style={interactive ? { cursor: "pointer" } : undefined}
    >
      {/* larger hit target while aiming */}
      {interactive ? (
        <circle r={CAKE_R + 10} fill="transparent" className="cursor-pointer" />
      ) : null}
      <circle r={CAKE_R} fill="#fff7ed" stroke="#fdba74" strokeWidth={2} />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 18, userSelect: "none" }}
        className={interactive ? "cursor-pointer" : undefined}
      >
        🎂
      </text>
    </g>
  );
}

const pillButtonBase =
  "inline-flex min-w-24 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

export function BirthdayAngryCake({
  yearOnly = false,
  minYear,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const yearMin = minYear ?? RANGES.year.min;
  const steps = yearOnly ? (["year"] as Step[]) : ALL_STEPS;
  const svgRef = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState<Step>(yearOnly ? "year" : "month");
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(initialYear ?? yearMin);
  const [phase, setPhase] = useState<Phase>("aiming");
  const [cake, setCake] = useState({ x: ANCHOR.x, y: ANCHOR.y });
  const [dragging, setDragging] = useState(false);
  const [aimDots, setAimDots] = useState<{ x: number; y: number }[]>([]);

  const velocityRef = useRef({ x: 0, y: 0 });
  const cakeRef = useRef(cake);
  const phaseRef = useRef(phase);
  const stepRef = useRef(step);
  const yearMinRef = useRef(yearMin);
  const onYearChangeRef = useRef(onYearChange);
  onYearChangeRef.current = onYearChange;

  cakeRef.current = cake;
  phaseRef.current = phase;
  stepRef.current = step;
  yearMinRef.current = yearMin;

  const setStepValue = useEffectEvent((next: number) => {
    const current = stepRef.current;
    if (current === "month") setMonth(next);
    if (current === "day") setDay(next);
    if (current === "year") {
      setYear(next);
      onYearChangeRef.current?.(next);
    }
  });

  const resetCake = useCallback(() => {
    setPhase("aiming");
    setCake({ x: ANCHOR.x, y: ANCHOR.y });
    setAimDots([]);
    velocityRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    resetCake();
  }, [step, resetCake]);

  useEffect(() => {
    if (phase !== "flying") return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      let { x: vx, y: vy } = velocityRef.current;
      vy += GRAVITY * dt;

      let x = cakeRef.current.x + vx * dt;
      let y = cakeRef.current.y + vy * dt;

      // side walls
      if (x - CAKE_R < 0) {
        x = CAKE_R;
        vx = Math.abs(vx) * WALL_BOUNCE;
      } else if (x + CAKE_R > WIDTH) {
        x = WIDTH - CAKE_R;
        vx = -Math.abs(vx) * WALL_BOUNCE;
      }

      // ground bounce / settle
      if (y + CAKE_R >= GROUND_Y) {
        y = GROUND_Y - CAKE_R;
        vy = -Math.abs(vy) * GROUND_BOUNCE;
        vx *= GROUND_FRICTION;

        if (Math.abs(vy) < SETTLE_VY && Math.abs(vx) < SETTLE_VX) {
          const landX = clamp(x, FIELD_LEFT, FIELD_RIGHT);
          const landRange =
            stepRef.current === "year"
              ? {
                  min: yearMinRef.current,
                  max: CREATOR_YEAR.max,
                  step: 1,
                }
              : RANGES[stepRef.current];
          setCake({ x: landX, y: GROUND_Y - CAKE_R });
          velocityRef.current = { x: 0, y: 0 };
          setPhase("landed");
          setStepValue(xToValue(landX, landRange));
          return;
        }
      }

      // soft ceiling
      if (y - CAKE_R < 8) {
        y = CAKE_R + 8;
        vy = Math.abs(vy) * 0.4;
      }

      velocityRef.current = { x: vx, y: vy };
      setCake({ x, y });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, setStepValue]);

  function updateAimPreview(pos: { x: number; y: number }) {
    const pullX = ANCHOR.x - pos.x;
    const pullY = ANCHOR.y - pos.y;
    let vx = pullX * LAUNCH_SCALE;
    let vy = pullY * LAUNCH_SCALE;
    let x = ANCHOR.x;
    let y = ANCHOR.y;
    const dots: { x: number; y: number }[] = [];
    const dt = 0.04;

    for (let i = 0; i < 22; i++) {
      vy += GRAVITY * dt;
      x += vx * dt;
      y += vy * dt;

      if (x - CAKE_R < 0) {
        x = CAKE_R;
        vx = Math.abs(vx) * WALL_BOUNCE;
      } else if (x + CAKE_R > WIDTH) {
        x = WIDTH - CAKE_R;
        vx = -Math.abs(vx) * WALL_BOUNCE;
      }

      if (y + CAKE_R >= GROUND_Y) {
        y = GROUND_Y - CAKE_R;
        vy = -Math.abs(vy) * GROUND_BOUNCE;
        vx *= GROUND_FRICTION;
      }

      dots.push({ x, y });
    }
    setAimDots(dots);
  }

  function onPointerDown(event: React.PointerEvent<SVGSVGElement>) {
    if (phaseRef.current !== "aiming") return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = pullFromPointer(event.clientX, event.clientY, rect);
    setDragging(true);
    setCake(pos);
    updateAimPreview(pos);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging || phaseRef.current !== "aiming") return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = pullFromPointer(event.clientX, event.clientY, rect);
    setCake(pos);
    updateAimPreview(pos);
  }

  function onPointerUp(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);

    const pullX = ANCHOR.x - cakeRef.current.x;
    const pullY = ANCHOR.y - cakeRef.current.y;
    const pull = Math.hypot(pullX, pullY);
    if (pull < 10) {
      setCake({ x: ANCHOR.x, y: ANCHOR.y });
      setAimDots([]);
      return;
    }

    velocityRef.current = {
      x: pullX * LAUNCH_SCALE,
      y: pullY * LAUNCH_SCALE,
    };
    setCake({ x: ANCHOR.x, y: ANCHOR.y });
    setAimDots([]);
    setPhase("flying");
  }

  const stepIndex = steps.indexOf(step);
  const range: FieldRange =
    step === "year"
      ? { min: yearMin, max: CREATOR_YEAR.max, step: 1 }
      : RANGES[step];
  const value = step === "month" ? month : step === "day" ? day : year;
  const display =
    step === "year" ? formatYear(value) : formatMonthOrDay(value);

  const ticks = (() => {
    if (step === "month") {
      return Array.from({ length: 12 }, (_, i) => {
        const tickValue = i + 1;
        const t = (tickValue - range.min) / (range.max - range.min);
        return {
          x: FIELD_LEFT + t * (FIELD_RIGHT - FIELD_LEFT),
          label: String(tickValue),
        };
      });
    }

    if (step === "day") {
      return Array.from({ length: 16 }, (_, i) => {
        const tickValue = Math.round(1 + (i / 15) * 30);
        const t = (tickValue - range.min) / (range.max - range.min);
        return {
          x: FIELD_LEFT + t * (FIELD_RIGHT - FIELD_LEFT),
          label: String(tickValue),
        };
      });
    }

    return Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      const tickValue = Math.round(range.min + t * (range.max - range.min));
      return {
        x: FIELD_LEFT + t * (FIELD_RIGHT - FIELD_LEFT),
        label: String(tickValue),
      };
    });
  })();

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {yearOnly
          ? formatYear(year)
          : `${formatMonthOrDay(month)} / ${formatMonthOrDay(day)} / ${formatYear(year)}`}
      </p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm tracking-wide text-zinc-500">{step}</span>
          <span className="font-sans text-2xl tabular-nums text-zinc-900">
            {display}
          </span>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className={[
              "h-auto w-full touch-none select-none rounded-2xl border border-zinc-200 bg-[#f7f4ef]",
              phase === "aiming" ? "cursor-pointer" : "",
              dragging ? "cursor-grabbing" : "",
            ].join(" ")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="img"
            aria-label={`slingshot for ${step}. drag the cake back and release.`}
          >
          <rect
            x={0}
            y={GROUND_Y}
            width={WIDTH}
            height={HEIGHT - GROUND_Y}
            fill="#d6c7a8"
          />
          <line
            x1={FIELD_LEFT}
            y1={GROUND_Y}
            x2={FIELD_RIGHT}
            y2={GROUND_Y}
            stroke="#a89878"
            strokeWidth={3}
          />

          {ticks.map((tick) => (
            <g key={tick.x}>
              <line
                x1={tick.x}
                y1={GROUND_Y}
                x2={tick.x}
                y2={GROUND_Y + 10}
                stroke="#8a7a5c"
                strokeWidth={2}
              />
              <text
                x={tick.x}
                y={GROUND_Y + 26}
                textAnchor="middle"
                className="fill-zinc-600"
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-rubik), sans-serif",
                }}
              >
                {tick.label}
              </text>
            </g>
          ))}

          <line
            x1={ANCHOR.x - 14}
            y1={ANCHOR.y + 48}
            x2={ANCHOR.x - 8}
            y2={ANCHOR.y}
            stroke="#5b3a1a"
            strokeWidth={8}
            strokeLinecap="round"
          />
          <line
            x1={ANCHOR.x + 14}
            y1={ANCHOR.y + 48}
            x2={ANCHOR.x + 8}
            y2={ANCHOR.y}
            stroke="#5b3a1a"
            strokeWidth={8}
            strokeLinecap="round"
          />

          {(dragging || phase === "aiming") && (
            <>
              <line
                x1={ANCHOR.x - 8}
                y1={ANCHOR.y}
                x2={cake.x}
                y2={cake.y}
                stroke="#3f3f46"
                strokeWidth={3}
              />
              <line
                x1={ANCHOR.x + 8}
                y1={ANCHOR.y}
                x2={cake.x}
                y2={cake.y}
                stroke="#3f3f46"
                strokeWidth={3}
              />
            </>
          )}

          {aimDots.map((dot, index) => (
            <circle
              key={`${dot.x}-${dot.y}-${index}`}
              cx={dot.x}
              cy={dot.y}
              r={2.5}
              fill="#a1a1aa"
              opacity={1 - index / aimDots.length}
            />
          ))}

          {phase === "landed" ? (
            <line
              x1={valueToX(value, range)}
              y1={GROUND_Y - 56}
              x2={valueToX(value, range)}
              y2={GROUND_Y}
              stroke="#18181b"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          ) : null}

            <CakeBall
              x={cake.x}
              y={cake.y}
              interactive={phase === "aiming"}
            />
          </svg>

          {phase === "landed" ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={resetCake}
                className={`${pillButtonBase} pointer-events-auto border-zinc-300 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-sm hover:border-zinc-900`}
              >
                launch again
              </button>
            </div>
          ) : null}
        </div>

        <p className="text-center text-sm text-zinc-500">
          {phase === "aiming"
            ? "pull the cake back and release to land on a number."
            : phase === "flying"
              ? "cake is bouncing..."
              : "landed. launch again or continue."}
        </p>
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
                className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800`}
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
