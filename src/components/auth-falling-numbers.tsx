"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

type Phase = "login" | "catching" | "checked-in";

type FallingDigit = {
  id: number;
  digit: number;
  x: number;
  y: number;
  speed: number;
  drift: number;
  size: number;
  caught?: boolean;
};

const PHONE = "0123456789";
const NEED = 6;

function randomDigit(id: number): FallingDigit {
  return {
    id,
    digit: Math.floor(Math.random() * 10),
    x: 8 + Math.random() * 84,
    y: -12 - Math.random() * 30,
    speed: 20 + Math.random() * 26,
    drift: (Math.random() - 0.5) * 12,
    size: 1.5 + Math.random() * 0.8,
  };
}

export function AuthFallingNumbers() {
  const [phase, setPhase] = useState<Phase>("login");
  const [picked, setPicked] = useState<number[]>([]);
  const [digits, setDigits] = useState<FallingDigit[]>([]);
  const idRef = useRef(0);
  const pickedRef = useRef<number[]>([]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  pickedRef.current = picked;

  const startCatching = useEffectEvent(() => {
    pickedRef.current = [];
    setPicked([]);
    idRef.current = 0;
    const starter: FallingDigit[] = [];
    for (let i = 0; i < 8; i++) {
      idRef.current += 1;
      starter.push(randomDigit(idRef.current));
    }
    setDigits(starter);
    setPhase("catching");
  });

  useEffect(() => {
    if (phase !== "catching") return;

    let frame = 0;
    let last = performance.now();
    let spawnAccrual = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spawnAccrual += dt;

      setDigits((prev) => {
        let next = prev
          .map((item) => {
            if (item.caught) return item;
            return {
              ...item,
              y: item.y + item.speed * dt,
              x: item.x + item.drift * dt,
            };
          })
          .filter((item) => item.y < 118);

        while (spawnAccrual > 0.38) {
          spawnAccrual -= 0.38;
          idRef.current += 1;
          next = [...next, randomDigit(idRef.current)];
        }

        if (next.filter((d) => !d.caught).length < 5) {
          idRef.current += 1;
          next = [...next, randomDigit(idRef.current)];
        }

        return next;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  function onDigitClick(item: FallingDigit) {
    if (phaseRef.current !== "catching" || item.caught) return;
    if (pickedRef.current.length >= NEED) return;

    setDigits((prev) => prev.filter((d) => d.id !== item.id));

    const next = [...pickedRef.current, item.digit];
    pickedRef.current = next;
    setPicked(next);

    if (next.length >= NEED) {
      window.setTimeout(() => {
        setPhase("checked-in");
        setDigits([]);
      }, 280);
    }
  }

  if (phase === "checked-in") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">you&apos;re checked in</p>
        </div>
      </div>
    );
  }

  if (phase === "catching") {
    return (
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: NEED }).map((_, i) => (
            <div
              key={i}
              className={[
                "flex h-9 w-7 items-center justify-center rounded-lg border font-sans text-sm tabular-nums",
                "border-zinc-200 text-zinc-900",
                picked[i] !== undefined
                  ? "bg-zinc-50"
                  : "bg-white text-zinc-300",
              ].join(" ")}
            >
              {picked[i] !== undefined ? picked[i] : "·"}
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          tap falling numbers. any six will do.
        </p>

        <div
          className="relative mt-5 h-[min(52vh,22rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-100 to-zinc-50"
          role="application"
          aria-label="falling numbers. tap six digits to verify."
        >
          {digits.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.caught}
              onClick={() => onDigitClick(item)}
              className={[
                "absolute -translate-x-1/2 cursor-pointer select-none font-sans tabular-nums text-zinc-800 transition-opacity duration-200",
                item.caught ? "pointer-events-none scale-125 opacity-0" : "",
              ].join(" ")}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}rem`,
              }}
              aria-label={`digit ${item.digit}`}
            >
              {item.digit}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm text-left">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm tracking-wide text-zinc-500">sign in</p>

        <label className="mt-4 block">
          <span className="text-sm text-zinc-500">phone number</span>
          <input
            type="tel"
            value={PHONE}
            readOnly
            tabIndex={-1}
            className="mt-1.5 w-full cursor-default rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-sans text-sm tabular-nums text-zinc-900 outline-none"
          />
        </label>

        <button
          type="button"
          onClick={startCatching}
          className="mt-5 w-full cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
        >
          verify with otp
        </button>
      </div>
    </div>
  );
}
