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
type Phase = "aiming" | "flying" | "stopped";

const MONTH_DAY_STEPS: Step[] = ["month", "day"];

const RANGES = {
  month: { min: 1, max: 12 },
  day: { min: 1, max: 31 },
  year: { min: CREATOR_YEAR.min, max: CREATOR_YEAR.max },
} as const;

const WIDTH = 560;
const HEIGHT = 320;
const CAKE_R = 16;
const LAUNCHER = { x: WIDTH / 2, y: HEIGHT - 36 };
const MAX_PULL = 88;
const GRAVITY = 980;
const LAUNCH_SCALE = 10.5;
const WALL_BOUNCE = 0.78;
const GROUND_BOUNCE = 0.62;
const GROUND_FRICTION = 0.88;
const SETTLE_VY = 48;
const SETTLE_VX = 32;

const pillButtonBase =
  "inline-flex min-w-24 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

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

function pullFromPointer(clientX: number, clientY: number, rect: DOMRect) {
  const x = ((clientX - rect.left) / rect.width) * WIDTH;
  const y = ((clientY - rect.top) / rect.height) * HEIGHT;
  const dx = x - LAUNCHER.x;
  const dy = y - LAUNCHER.y;
  const dist = Math.hypot(dx, dy);
  const limited = Math.min(dist, MAX_PULL);
  const angle = Math.atan2(dy, dx);
  return {
    x: LAUNCHER.x + Math.cos(angle) * limited,
    y: LAUNCHER.y + Math.sin(angle) * limited,
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
      style={interactive ? { cursor: "pointer" } : undefined}
    >
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

export function BirthdayBounce({
  yearOnly = false,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const steps = yearOnly ? (["year"] as Step[]) : MONTH_DAY_STEPS;
  const svgRef = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState<Step>(yearOnly ? "year" : "month");
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(initialYear ?? null);
  const [phase, setPhase] = useState<Phase>("aiming");
  const [cake, setCake] = useState(LAUNCHER);
  const [bounces, setBounces] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [aimDots, setAimDots] = useState<{ x: number; y: number }[]>([]);

  const velocityRef = useRef({ x: 0, y: 0 });
  const cakeRef = useRef(cake);
  const phaseRef = useRef(phase);
  const bouncesRef = useRef(0);
  const stepRef = useRef(step);
  const onYearChangeRef = useRef(onYearChange);
  onYearChangeRef.current = onYearChange;

  cakeRef.current = cake;
  phaseRef.current = phase;
  bouncesRef.current = bounces;
  stepRef.current = step;

  const range = RANGES[step];
  const stepIndex = steps.indexOf(step);

  const lockValue = useEffectEvent((count: number) => {
    const current = stepRef.current;
    if (current === "month") setMonth(count);
    else if (current === "day") setDay(count);
    else {
      const nextYear = CREATOR_YEAR.min + count;
      setYear(nextYear);
      onYearChangeRef.current?.(nextYear);
    }
    setPhase("stopped");
    velocityRef.current = { x: 0, y: 0 };
  });

  const resetAim = useCallback(() => {
    setPhase("aiming");
    setCake(LAUNCHER);
    setBounces(0);
    bouncesRef.current = 0;
    velocityRef.current = { x: 0, y: 0 };
    setDragging(false);
    setAimDots([]);
  }, []);

  useEffect(() => {
    resetAim();
  }, [step, resetAim]);

  function updateAimPreview(pos: { x: number; y: number }) {
    const pullX = LAUNCHER.x - pos.x;
    const pullY = LAUNCHER.y - pos.y;
    let vx = pullX * LAUNCH_SCALE;
    let vy = pullY * LAUNCH_SCALE;
    let x = LAUNCHER.x;
    let y = LAUNCHER.y;
    const dots: { x: number; y: number }[] = [];
    for (let i = 0; i < 12; i++) {
      vy += GRAVITY * 0.04;
      x += vx * 0.04;
      y += vy * 0.04;
      if (y > HEIGHT - CAKE_R || x < CAKE_R || x > WIDTH - CAKE_R) break;
      dots.push({ x, y });
    }
    setAimDots(dots);
  }

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
      let hits = 0;

      if (x - CAKE_R < 0) {
        x = CAKE_R;
        vx = Math.abs(vx) * WALL_BOUNCE;
        hits += 1;
      } else if (x + CAKE_R > WIDTH) {
        x = WIDTH - CAKE_R;
        vx = -Math.abs(vx) * WALL_BOUNCE;
        hits += 1;
      }

      if (y - CAKE_R < 0) {
        y = CAKE_R;
        vy = Math.abs(vy) * WALL_BOUNCE;
        hits += 1;
      } else if (y + CAKE_R >= HEIGHT) {
        y = HEIGHT - CAKE_R;
        vy = -Math.abs(vy) * GROUND_BOUNCE;
        vx *= GROUND_FRICTION;
        hits += 1;

        if (Math.abs(vy) < SETTLE_VY && Math.abs(vx) < SETTLE_VX) {
          if (hits > 0) {
            const next = bouncesRef.current + hits;
            bouncesRef.current = next;
            setBounces(next);
          }
          setCake({ x, y });
          velocityRef.current = { x: 0, y: 0 };
          lockValue(bouncesRef.current);
          return;
        }
      }

      velocityRef.current = { x: vx, y: vy };
      setCake({ x, y });

      if (hits > 0) {
        const next = bouncesRef.current + hits;
        bouncesRef.current = next;
        setBounces(next);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, lockValue]);

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

    const pullX = LAUNCHER.x - cakeRef.current.x;
    const pullY = LAUNCHER.y - cakeRef.current.y;
    const pull = Math.hypot(pullX, pullY);
    if (pull < 10) {
      setCake(LAUNCHER);
      setAimDots([]);
      return;
    }

    bouncesRef.current = 0;
    setBounces(0);
    velocityRef.current = {
      x: pullX * LAUNCH_SCALE,
      y: pullY * LAUNCH_SCALE,
    };
    setCake({ ...LAUNCHER });
    setAimDots([]);
    setPhase("flying");
  }

  const lockedValue =
    step === "month" ? month : step === "day" ? day : year;
  const inRange =
    lockedValue !== null &&
    lockedValue >= range.min &&
    lockedValue <= range.max;
  const error =
    phase === "stopped" && !inRange
      ? step === "year"
        ? `need ${range.min - CREATOR_YEAR.min}–${range.max - CREATOR_YEAR.min} bounces (year ${range.min}–${range.max})`
        : step === "month"
          ? `need ${range.min}–${range.max} bounces for a month`
          : `need ${range.min}–${range.max} bounces for a day`
      : null;

  const status =
    phase === "aiming"
      ? step === "year"
        ? "pull back from the launcher. each bounce adds a year from 1900."
        : `pull back from the launcher. wall hits count for ${step}.`
      : phase === "flying"
        ? "bouncing..."
        : inRange
          ? "settled. bounce again or continue."
          : "out of range. bounce again.";

  const liveYear =
    step === "year" ? CREATOR_YEAR.min + bounces : null;

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {yearOnly
          ? formatYear(
              phase === "flying" || phase === "aiming"
                ? liveYear
                : year,
            )
          : `${formatMonthOrDay(month)} / ${formatMonthOrDay(day)}`}
      </p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm tracking-wide text-zinc-500">{step}</span>
          <span className="font-sans text-2xl tabular-nums text-zinc-900">
            {bounces}{" "}
            <span className="text-base text-zinc-500">bounces</span>
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
            aria-label={`bounce launcher for ${step}. pull the cake back and release.`}
          >
            <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#f7f4ef" />

            {/* floor strip */}
            <rect
              x={0}
              y={HEIGHT - 22}
              width={WIDTH}
              height={22}
              fill="#d6c7a8"
            />

            {/* launcher base */}
            <rect
              x={LAUNCHER.x - 28}
              y={HEIGHT - 22}
              width={56}
              height={10}
              rx={3}
              fill="#8a7a5c"
            />
            <rect
              x={LAUNCHER.x - 8}
              y={LAUNCHER.y - 6}
              width={16}
              height={18}
              rx={3}
              fill="#5b3a1a"
            />

            {(dragging || phase === "aiming") && (
              <>
                <line
                  x1={LAUNCHER.x - 6}
                  y1={LAUNCHER.y}
                  x2={cake.x}
                  y2={cake.y}
                  stroke="#3f3f46"
                  strokeWidth={3}
                />
                <line
                  x1={LAUNCHER.x + 6}
                  y1={LAUNCHER.y}
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

            <CakeBall
              x={cake.x}
              y={cake.y}
              interactive={phase === "aiming"}
            />
          </svg>

          {phase === "stopped" ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={resetAim}
                className={`${pillButtonBase} pointer-events-auto border-zinc-300 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-sm hover:border-zinc-900`}
              >
                bounce again
              </button>
            </div>
          ) : null}
        </div>

        <p className="min-h-5 text-center text-sm text-red-600" role="status">
          {error ?? ""}
        </p>
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
                disabled={phase === "flying" || !inRange}
                className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 disabled:cursor-default disabled:opacity-40`}
              >
                next
              </button>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            step {stepIndex + 1} of {steps.length}: {step} ({range.min}–
            {range.max} bounces)
          </p>
        </>
      )}
      {yearOnly ? (
        <p className="mt-4 text-sm text-zinc-400">
          year = 1900 + bounces ({range.min}–{range.max})
        </p>
      ) : null}
    </div>
  );
}
