"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CREATOR_AGE, type YearPickerProps } from "@/lib/creator";

type Phase = "idle" | "spinning" | "stopping" | "done";

const COLORS = ["#673ab7", "#f59e0b", "#38bdf8", "#34d399", "#fb7185", "#a1a1aa"];

function mod(value: number, base: number) {
  return ((value % base) + base) % base;
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function wedgePath(
  cx: number,
  cy: number,
  radius: number,
  start: number,
  end: number,
) {
  const startPoint = polar(cx, cy, radius, start);
  const endPoint = polar(cx, cy, radius, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${large} 1 ${endPoint.x} ${endPoint.y} Z`;
}

export function BirthdayWheel({
  minYear = CREATOR_AGE.min,
  maxYear = CREATOR_AGE.max,
  initialYear,
  onYearChange,
}: YearPickerProps = {}) {
  const min = Math.max(0, minYear);
  const max = Math.max(min, maxYear);
  const values = useMemo(() => {
    const list: number[] = [];
    for (let value = min; value <= max; value += 1) list.push(value);
    return list;
  }, [min, max]);
  const slice = 360 / values.length;

  const startIndex = Math.max(
    0,
    Math.min(values.length - 1, (initialYear ?? min) - min),
  );

  const [phase, setPhase] = useState<Phase>("idle");
  const [rotation, setRotation] = useState(-(startIndex * slice + slice / 2));
  const [age, setAge] = useState(values[startIndex] ?? min);

  const phaseRef = useRef(phase);
  const rotationRef = useRef(rotation);
  const velocityRef = useRef(0);
  phaseRef.current = phase;
  rotationRef.current = rotation;

  function ageAt(angle: number) {
    const index = Math.floor(mod(-angle, 360) / slice) % values.length;
    return values[index] ?? min;
  }

  useEffect(() => {
    if (phase !== "spinning" && phase !== "stopping") return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      if (phaseRef.current === "stopping") {
        velocityRef.current = Math.max(0, velocityRef.current - 680 * dt);
      }

      let next = rotationRef.current + velocityRef.current * dt;
      if (phaseRef.current === "stopping" && velocityRef.current <= 24) {
        const index = Math.floor(mod(-next, 360) / slice) % values.length;
        const center = -(index * slice + slice / 2);
        const turns = Math.round((next - center) / 360);
        next = center + turns * 360;
        velocityRef.current = 0;
        rotationRef.current = next;
        setRotation(next);
        const landed = values[index] ?? min;
        setAge(landed);
        setPhase("done");
        onYearChange?.(landed);
        return;
      }

      rotationRef.current = next;
      setRotation(next);
      setAge(ageAt(next));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, min, onYearChange, slice, values]);

  function spin() {
    if (phaseRef.current === "spinning" || phaseRef.current === "stopping") return;
    velocityRef.current = 540 + Math.random() * 220;
    setPhase("spinning");
  }

  function stop() {
    if (phaseRef.current !== "spinning") return;
    setPhase("stopping");
  }

  const spinning = phase === "spinning" || phase === "stopping";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
      <p className="font-sans text-4xl tabular-nums text-zinc-900">{age}</p>
      <p className="mt-1 text-sm text-zinc-500">
        {phase === "idle"
          ? "click the wheel"
          : phase === "done"
            ? "click the wheel to spin again"
            : phase === "stopping"
              ? "slowing down..."
              : "spinning..."}
      </p>

      <div className="relative mt-5">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "16px solid #18181b",
          }}
        />
        <button
          type="button"
          onClick={spin}
          aria-label="spin the wheel"
          className="relative block cursor-pointer rounded-full"
        >
          <svg viewBox="0 0 320 320" className="h-64 w-64 sm:h-72 sm:w-72">
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "160px 160px",
              }}
            >
              {values.map((value, index) => {
                const start = index * slice;
                const showLabel = values.length <= 24 || index % 10 === 0;
                const mid = start + slice / 2;
                const label = polar(160, 160, 118, mid);
                return (
                  <g key={value}>
                    <path
                      d={wedgePath(160, 160, 148, start, start + slice)}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth="1"
                    />
                    {showLabel ? (
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        className="font-sans text-[9px] tabular-nums"
                        transform={`rotate(${mid}, ${label.x}, ${label.y})`}
                      >
                        {value}
                      </text>
                    ) : null}
                  </g>
                );
              })}
              <circle cx="160" cy="160" r="28" fill="white" />
              <circle cx="160" cy="160" r="8" fill="#18181b" />
            </g>
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={stop}
        disabled={!spinning}
        className="mt-4 cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-default disabled:border-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-500"
      >
        {phase === "stopping" ? "stopping..." : "stop"}
      </button>
    </div>
  );
}
