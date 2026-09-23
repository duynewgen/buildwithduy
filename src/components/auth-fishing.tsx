"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FishingHook, FishingRod } from "lucide-react";

type Phase = "login" | "fishing" | "checked-in";
type CastPhase = "aiming" | "casting" | "reeling";

type Fish = {
  id: number;
  digit: number;
  x: number;
  y: number;
  vx: number;
  size: number;
  flip: boolean;
};

const PHONE = "0123456789";
const NEED = 4;
const POND_FISH = 6;
const AIM_MIN = 12;
const AIM_MAX = 88;
const HOOK_DEPTH = 72;
const CATCH_RADIUS = 11;

function spawnFish(id: number): Fish {
  const vx = (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 20);
  return {
    id,
    digit: Math.floor(Math.random() * 10),
    x: 10 + Math.random() * 80,
    y: 28 + Math.random() * 52,
    vx,
    size: 42 + Math.random() * 18,
    flip: vx < 0,
  };
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export function AuthFishing() {
  const [phase, setPhase] = useState<Phase>("login");
  const [picked, setPicked] = useState<number[]>([]);
  const [fish, setFish] = useState<Fish[]>([]);
  const [aimX, setAimX] = useState(50);
  const [throwX, setThrowX] = useState(50);
  const [hookY, setHookY] = useState(14);
  const [castPhase, setCastPhase] = useState<CastPhase>("aiming");
  const [splash, setSplash] = useState(false);
  const [missFlash, setMissFlash] = useState(false);

  const idRef = useRef(0);
  const pickedRef = useRef<number[]>([]);
  const phaseRef = useRef(phase);
  const castRef = useRef<CastPhase>("aiming");
  const aimXRef = useRef(50);
  const hookYRef = useRef(14);
  const throwXRef = useRef(50);
  const fishRef = useRef<Fish[]>([]);
  const castTimerRef = useRef(0);

  phaseRef.current = phase;
  castRef.current = castPhase;
  aimXRef.current = aimX;
  hookYRef.current = hookY;
  throwXRef.current = throwX;
  fishRef.current = fish;
  pickedRef.current = picked;

  useEffect(() => {
    return () => window.clearTimeout(castTimerRef.current);
  }, []);

  const startFishing = useEffectEvent(() => {
    window.clearTimeout(castTimerRef.current);
    pickedRef.current = [];
    setPicked([]);
    setSplash(false);
    setMissFlash(false);
    setCastPhase("aiming");
    castRef.current = "aiming";
    setAimX(50);
    setThrowX(50);
    setHookY(14);
    aimXRef.current = 50;
    throwXRef.current = 50;
    hookYRef.current = 14;
    idRef.current = 0;
    const starter: Fish[] = [];
    for (let i = 0; i < POND_FISH; i++) {
      idRef.current += 1;
      starter.push(spawnFish(idRef.current));
    }
    fishRef.current = starter;
    setFish(starter);
    setPhase("fishing");
  });

  useEffect(() => {
    if (phase !== "fishing") return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // rod steers left ↔ right while aiming
      if (castRef.current === "aiming") {
        const t = now / 1000;
        const nextAim =
          (AIM_MIN + AIM_MAX) / 2 +
          ((AIM_MAX - AIM_MIN) / 2) * Math.sin(t * 1.35);
        aimXRef.current = nextAim;
        setAimX(nextAim);
        hookYRef.current = 14;
        setHookY(14);
      }

      // fish swim
      const nextFish = fishRef.current.map((f) => {
        let x = f.x + f.vx * dt;
        let vx = f.vx;
        let flip = f.flip;
        if (x < 8) {
          x = 8;
          vx = Math.abs(vx);
          flip = false;
        } else if (x > 92) {
          x = 92;
          vx = -Math.abs(vx);
          flip = true;
        }
        const y = f.y + Math.sin(now / 480 + f.id) * 0.12;
        return { ...f, x, y, vx, flip };
      });
      fishRef.current = nextFish;
      setFish(nextFish);

      // while line is out, try to snag a fish near the hook
      if (castRef.current === "casting") {
        const hookX = throwXRef.current;
        const hookYNow = hookYRef.current;
        const hit = nextFish.find(
          (f) => dist(f.x, f.y, hookX, hookYNow) <= CATCH_RADIUS,
        );
        if (hit) {
          landCatch(hit);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  function landCatch(target: Fish) {
    if (castRef.current !== "casting") return;
    castRef.current = "reeling";
    setCastPhase("reeling");
    window.clearTimeout(castTimerRef.current);
    setSplash(true);

    const without = fishRef.current.filter((f) => f.id !== target.id);
    idRef.current += 1;
    const refreshed = [...without, spawnFish(idRef.current)];
    fishRef.current = refreshed;
    setFish(refreshed);

    const next = [...pickedRef.current, target.digit];
    pickedRef.current = next;
    setPicked(next);

    // reel hook up
    hookYRef.current = 14;
    setHookY(14);

    castTimerRef.current = window.setTimeout(() => {
      setSplash(false);
      if (next.length >= NEED) {
        setPhase("checked-in");
        setFish([]);
        return;
      }
      castRef.current = "aiming";
      setCastPhase("aiming");
    }, 480);
  }

  function throwRod() {
    if (phaseRef.current !== "fishing") return;
    if (castRef.current !== "aiming") return;
    if (pickedRef.current.length >= NEED) return;

    const castAt = aimXRef.current;
    throwXRef.current = castAt;
    setThrowX(castAt);
    castRef.current = "casting";
    setCastPhase("casting");
    setMissFlash(false);

    // drop hook
    const start = performance.now();
    const from = 14;
    const to = HOOK_DEPTH;
    const duration = 520;

    const animateDrop = (now: number) => {
      if (castRef.current !== "casting") return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const y = from + (to - from) * eased;
      hookYRef.current = y;
      setHookY(y);
      if (t < 1) {
        requestAnimationFrame(animateDrop);
        return;
      }
      // brief linger at depth, then miss + reel if nothing bit
      castTimerRef.current = window.setTimeout(() => {
        if (castRef.current !== "casting") return;
        setMissFlash(true);
        castRef.current = "reeling";
        setCastPhase("reeling");
        hookYRef.current = 14;
        setHookY(14);
        castTimerRef.current = window.setTimeout(() => {
          setMissFlash(false);
          castRef.current = "aiming";
          setCastPhase("aiming");
        }, 350);
      }, 280);
    };

    requestAnimationFrame(animateDrop);
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

  if (phase === "fishing") {
    const lineX = castPhase === "aiming" ? aimX : throwX;

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

        <div
          className={[
            "relative mt-5 h-[min(52vh,22rem)] overflow-hidden rounded-2xl border border-sky-200",
            missFlash ? "ring-2 ring-rose-300" : "",
          ].join(" ")}
          role="application"
          aria-label="fishing pond. wait for the rod to line up, then throw."
          style={{
            background:
              "linear-gradient(180deg, #bae6fd 0%, #38bdf8 30%, #0284c7 70%, #075985 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45), transparent)",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-[#8b6914]/50"
          />

          <div
            className="pointer-events-none absolute top-0.5 flex -translate-x-1/2 items-center"
            style={{ left: `${lineX}%` }}
          >
            <FishingRod
              className="h-6 w-6 text-amber-950 drop-shadow-sm"
              strokeWidth={2}
              aria-hidden
            />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute top-6 w-px bg-zinc-900/60"
            style={{
              left: `${lineX}%`,
              height: `${Math.max(0, hookY - 8)}%`,
            }}
          />
          <div
            className={[
              "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-zinc-900",
              splash ? "scale-150 opacity-0 transition duration-300" : "",
            ].join(" ")}
            style={{ left: `${lineX}%`, top: `${hookY}%` }}
          >
            <FishingHook className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </div>

          {fish.map((f) => (
            <div
              key={f.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: f.size,
                height: f.size * 0.6,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/authentication/fish.svg"
                alt=""
                className="h-full w-full object-contain drop-shadow-sm"
                style={{ transform: f.flip ? "scaleX(-1)" : undefined }}
                draggable={false}
              />
              <span className="absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 font-sans text-[10px] tabular-nums text-zinc-900 shadow-sm sm:size-6 sm:text-xs">
                {f.digit}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={throwRod}
          disabled={castPhase !== "aiming"}
          className="mt-4 w-full max-w-xs cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-default disabled:border-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-500"
        >
          {castPhase === "aiming"
            ? "throw"
            : castPhase === "casting"
              ? "casting…"
              : "reeling…"}
        </button>
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
          onClick={startFishing}
          className="mt-5 w-full cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
        >
          verify with otp
        </button>
      </div>
    </div>
  );
}
