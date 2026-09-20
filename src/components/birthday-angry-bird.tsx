"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

type Step = "month" | "day" | "year";
type Phase = "aiming" | "flying" | "landed";

const STEPS: Step[] = ["month", "day", "year"];

const RANGES = {
  month: { min: 0, max: 12, step: 0.1 },
  day: { min: 0, max: 31, step: 0.1 },
  year: { min: 0, max: 2026, step: 1 },
} as const;

const WIDTH = 640;
const HEIGHT = 320;
const GROUND_Y = 268;
const ANCHOR = { x: 72, y: 220 };
const BIRD_R = 14;
const MAX_PULL = 78;
const GRAVITY = 980;
const LAUNCH_SCALE = 7.2;
const FIELD_LEFT = 130;
const FIELD_RIGHT = 600;

function snapToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isWholeNumber(value: number) {
  return Math.abs(value - Math.round(value)) < 1e-9;
}

function formatMonthOrDay(value: number) {
  if (isWholeNumber(value)) {
    return String(Math.round(value)).padStart(2, "0");
  }
  return snapToStep(value, 0.1).toFixed(1);
}

function formatYear(value: number) {
  return String(Math.round(value)).padStart(4, "0");
}

function xToValue(x: number, step: Step) {
  const range = RANGES[step];
  const t = clamp((x - FIELD_LEFT) / (FIELD_RIGHT - FIELD_LEFT), 0, 1);
  const raw = range.min + t * (range.max - range.min);
  return clamp(snapToStep(raw, range.step), range.min, range.max);
}

function valueToX(value: number, step: Step) {
  const range = RANGES[step];
  const t = (value - range.min) / (range.max - range.min);
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

const pillButtonBase =
  "inline-flex min-w-24 items-center justify-center rounded-full border px-4 py-2 text-sm transition";

export function BirthdayAngryBird() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState<Step>("month");
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);
  const [phase, setPhase] = useState<Phase>("aiming");
  const [bird, setBird] = useState({ x: ANCHOR.x, y: ANCHOR.y });
  const [dragging, setDragging] = useState(false);
  const [aimDots, setAimDots] = useState<{ x: number; y: number }[]>([]);

  const velocityRef = useRef({ x: 0, y: 0 });
  const birdRef = useRef(bird);
  const phaseRef = useRef(phase);
  const stepRef = useRef(step);

  birdRef.current = bird;
  phaseRef.current = phase;
  stepRef.current = step;

  const setStepValue = useEffectEvent((next: number) => {
    const current = stepRef.current;
    if (current === "month") setMonth(next);
    if (current === "day") setDay(next);
    if (current === "year") setYear(next);
  });

  const resetBird = useCallback(() => {
    setPhase("aiming");
    setBird({ x: ANCHOR.x, y: ANCHOR.y });
    setAimDots([]);
    velocityRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    resetBird();
  }, [step, resetBird]);

  useEffect(() => {
    if (phase !== "flying") return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      velocityRef.current.y += GRAVITY * dt;
      const next = {
        x: birdRef.current.x + velocityRef.current.x * dt,
        y: birdRef.current.y + velocityRef.current.y * dt,
      };

      if (next.y + BIRD_R >= GROUND_Y || next.x > WIDTH + 40 || next.x < -40) {
        const landX = clamp(next.x, FIELD_LEFT, FIELD_RIGHT);
        const landed = { x: landX, y: GROUND_Y - BIRD_R };
        setBird(landed);
        setPhase("landed");
        setStepValue(xToValue(landX, stepRef.current));
        return;
      }

      setBird(next);
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
    for (let i = 0; i < 14; i++) {
      vx = vx;
      vy += GRAVITY * 0.045;
      x += vx * 0.045;
      y += vy * 0.045;
      if (y > GROUND_Y) break;
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
    setBird(pos);
    updateAimPreview(pos);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging || phaseRef.current !== "aiming") return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = pullFromPointer(event.clientX, event.clientY, rect);
    setBird(pos);
    updateAimPreview(pos);
  }

  function onPointerUp(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);

    const pullX = ANCHOR.x - birdRef.current.x;
    const pullY = ANCHOR.y - birdRef.current.y;
    const pull = Math.hypot(pullX, pullY);
    if (pull < 10) {
      setBird({ x: ANCHOR.x, y: ANCHOR.y });
      setAimDots([]);
      return;
    }

    velocityRef.current = {
      x: pullX * LAUNCH_SCALE,
      y: pullY * LAUNCH_SCALE,
    };
    setBird({ x: ANCHOR.x, y: ANCHOR.y });
    setAimDots([]);
    setPhase("flying");
  }

  const stepIndex = STEPS.indexOf(step);
  const range = RANGES[step];
  const value = step === "month" ? month : step === "day" ? day : year;
  const display =
    step === "year" ? formatYear(value) : formatMonthOrDay(value);
  const error =
    step === "month" && !isWholeNumber(month)
      ? "sorry this is not a valid month"
      : step === "day" && !isWholeNumber(day)
        ? "sorry this is not a valid day"
        : null;

  const ticks = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const tickValue = range.min + t * (range.max - range.min);
    return {
      x: FIELD_LEFT + t * (FIELD_RIGHT - FIELD_LEFT),
      label:
        step === "year"
          ? String(Math.round(tickValue))
          : snapToStep(tickValue, range.step).toFixed(
              isWholeNumber(snapToStep(tickValue, range.step)) ? 0 : 1,
            ),
    };
  });

  return (
    <div className="w-full text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        {formatMonthOrDay(month)} / {formatMonthOrDay(day)} / {formatYear(year)}
      </p>

      <div className="mt-8 space-y-3 text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm tracking-wide text-zinc-500">{step}</span>
          <span className="font-sans text-2xl tabular-nums text-zinc-900">
            {display}
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full touch-none select-none rounded-2xl border border-zinc-200 bg-[#f7f4ef]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="img"
          aria-label={`slingshot for ${step}. drag the bird back and release.`}
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
                style={{ fontSize: 11, fontFamily: "var(--font-rubik), sans-serif" }}
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* slingshot */}
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
                x2={bird.x}
                y2={bird.y}
                stroke="#3f3f46"
                strokeWidth={3}
              />
              <line
                x1={ANCHOR.x + 8}
                y1={ANCHOR.y}
                x2={bird.x}
                y2={bird.y}
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
              x1={valueToX(value, step)}
              y1={GROUND_Y - 56}
              x2={valueToX(value, step)}
              y2={GROUND_Y}
              stroke="#18181b"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          ) : null}

          {/* bird */}
          <g transform={`translate(${bird.x} ${bird.y})`}>
            <circle r={BIRD_R} fill="#dc2626" />
            <circle cx={-4} cy={-3} r={3.2} fill="#fff" />
            <circle cx={5} cy={-3} r={3.2} fill="#fff" />
            <circle cx={-3} cy={-3} r={1.4} fill="#18181b" />
            <circle cx={6} cy={-3} r={1.4} fill="#18181b" />
            <path d="M -2 4 Q 0 8 2 4" fill="none" stroke="#18181b" strokeWidth={1.5} />
            <path d="M 10 -1 L 18 0 L 10 2 Z" fill="#f59e0b" />
          </g>
        </svg>

        <p className="min-h-5 text-sm text-red-600" role="status">
          {error ?? ""}
        </p>

        <p className="text-center text-sm text-zinc-500">
          {phase === "aiming"
            ? "pull the bird back and release to land on a number."
            : phase === "flying"
              ? "flying..."
              : "landed. shoot again or continue."}
        </p>
      </div>

      <div className="mt-8 flex min-h-10 flex-wrap items-center justify-center gap-3">
        {phase === "landed" ? (
          <button
            type="button"
            onClick={resetBird}
            className={`${pillButtonBase} border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900`}
          >
            shoot again
          </button>
        ) : null}
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => setStep(STEPS[stepIndex - 1])}
            className={`${pillButtonBase} border-zinc-900 bg-transparent text-zinc-900 hover:bg-zinc-100`}
          >
            previous
          </button>
        ) : null}
        {stepIndex < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(STEPS[stepIndex + 1])}
            className={`${pillButtonBase} border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800`}
          >
            next
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-zinc-400">
        step {stepIndex + 1} of {STEPS.length}: {step}
      </p>
    </div>
  );
}
