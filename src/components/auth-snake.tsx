"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

type Phase = "login" | "playing" | "checked-in";
type Point = { x: number; y: number };
type Dir = Point;
type Ball = { id: number; pos: Point; digit: number };

const PHONE = "0123456789";
const NEED = 6;
const COLS = 14;
const ROWS = 14;
const TICK_MS = 120;
const BALL_COUNT = 9;

const BALL_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-pink-500",
] as const;

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
} as const;

function same(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function randomEmpty(occupied: Point[]): Point {
  for (let attempt = 0; attempt < 120; attempt++) {
    const pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!occupied.some((p) => same(p, pos))) return pos;
  }
  return { x: 0, y: 0 };
}

function spawnBall(id: number, occupied: Point[]): Ball {
  return {
    id,
    pos: randomEmpty(occupied),
    digit: Math.floor(Math.random() * 10),
  };
}

function spawnBalls(count: number, occupied: Point[], startId: number) {
  const balls: Ball[] = [];
  let id = startId;
  for (let i = 0; i < count; i++) {
    id += 1;
    const blocked = [...occupied, ...balls.map((b) => b.pos)];
    balls.push(spawnBall(id, blocked));
  }
  return { balls, nextId: id };
}

function initialState() {
  const snake: Point[] = [
    { x: 4, y: 7 },
    { x: 3, y: 7 },
  ];
  const { balls, nextId } = spawnBalls(BALL_COUNT, snake, 0);
  return { snake, balls, nextId, dir: { x: 1, y: 0 } as Dir };
}

export function AuthSnake() {
  const [phase, setPhase] = useState<Phase>("login");
  const [snake, setSnake] = useState<Point[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [dir, setDir] = useState<Dir>({ x: 1, y: 0 });
  const [dead, setDead] = useState(false);
  const [flash, setFlash] = useState(false);

  const phaseRef = useRef(phase);
  const snakeRef = useRef(snake);
  const ballsRef = useRef(balls);
  const pickedRef = useRef(picked);
  const dirRef = useRef<Dir>({ x: 1, y: 0 });
  const pendingDirRef = useRef<Dir>({ x: 1, y: 0 });
  const nextIdRef = useRef(0);
  const touchStartRef = useRef<Point | null>(null);
  const deadTimerRef = useRef(0);

  phaseRef.current = phase;
  snakeRef.current = snake;
  ballsRef.current = balls;
  pickedRef.current = picked;

  useEffect(() => {
    return () => window.clearTimeout(deadTimerRef.current);
  }, []);

  const startPlaying = useEffectEvent(() => {
    window.clearTimeout(deadTimerRef.current);
    const start = initialState();
    snakeRef.current = start.snake;
    ballsRef.current = start.balls;
    pickedRef.current = [];
    dirRef.current = start.dir;
    pendingDirRef.current = start.dir;
    nextIdRef.current = start.nextId;
    setSnake(start.snake);
    setBalls(start.balls);
    setPicked([]);
    setDir(start.dir);
    setDead(false);
    setFlash(false);
    setPhase("playing");
  });

  function setDirection(next: Dir) {
    if (dead) return;
    const cur = dirRef.current;
    if (cur.x + next.x === 0 && cur.y + next.y === 0) return;
    pendingDirRef.current = next;
  }

  function dieAndRestart() {
    setDead(true);
    setFlash(true);
    pickedRef.current = [];
    setPicked([]);
    window.clearTimeout(deadTimerRef.current);
    deadTimerRef.current = window.setTimeout(() => {
      const restart = initialState();
      snakeRef.current = restart.snake;
      ballsRef.current = restart.balls;
      dirRef.current = restart.dir;
      pendingDirRef.current = restart.dir;
      nextIdRef.current = restart.nextId;
      setSnake(restart.snake);
      setBalls(restart.balls);
      setDir(restart.dir);
      setDead(false);
      setFlash(false);
    }, 900);
  }

  useEffect(() => {
    if (phase !== "playing") return;

    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const next = DIRS[key as keyof typeof DIRS];
      if (!next) return;
      event.preventDefault();
      setDirection(next);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const tick = window.setInterval(() => {
      if (phaseRef.current !== "playing") return;
      if (dead) return;

      dirRef.current = pendingDirRef.current;
      setDir(dirRef.current);
      const move = dirRef.current;
      const body = snakeRef.current;
      const head = body[0]!;
      const nextHead = { x: head.x + move.x, y: head.y + move.y };

      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= COLS ||
        nextHead.y < 0 ||
        nextHead.y >= ROWS;
      const hitSelf = body.some((segment) => same(segment, nextHead));

      if (hitWall || hitSelf) {
        dieAndRestart();
        return;
      }

      const eaten = ballsRef.current.find((ball) => same(ball.pos, nextHead));
      let nextSnake: Point[];

      if (eaten) {
        // grow: keep the tail
        nextSnake = [nextHead, ...body];
        const nextPicked = [...pickedRef.current, eaten.digit].slice(0, NEED);
        pickedRef.current = nextPicked;
        setPicked(nextPicked);

        // refresh all 9 numbered balls in new positions
        const refreshed = spawnBalls(
          BALL_COUNT,
          nextSnake,
          nextIdRef.current,
        );
        nextIdRef.current = refreshed.nextId;
        ballsRef.current = refreshed.balls;
        setBalls(refreshed.balls);

        snakeRef.current = nextSnake;
        setSnake(nextSnake);

        if (nextPicked.length >= NEED) {
          window.setTimeout(() => setPhase("checked-in"), 350);
        }
        return;
      }

      // move without growing
      nextSnake = [nextHead, ...body.slice(0, -1)];
      snakeRef.current = nextSnake;
      setSnake(nextSnake);
    }, TICK_MS);

    return () => window.clearInterval(tick);
  }, [phase, dead]);

  function onTouchStart(clientX: number, clientY: number) {
    touchStartRef.current = { x: clientX, y: clientY };
  }

  function onTouchEnd(clientX: number, clientY: number) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const dx = clientX - start.x;
    const dy = clientY - start.y;
    if (Math.hypot(dx, dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? DIRS.ArrowRight : DIRS.ArrowLeft);
    } else {
      setDirection(dy > 0 ? DIRS.ArrowDown : DIRS.ArrowUp);
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

  if (phase === "playing") {
    return (
      <div className="mx-auto w-full max-w-md text-center">
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
            "relative mx-auto mt-4 aspect-square w-full max-w-sm touch-none overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900",
            flash ? "ring-2 ring-rose-400" : "",
          ].join(" ")}
          role="application"
          aria-label="snake game. chase numbered balls. grow longer. don't die."
          onTouchStart={(event) => {
            const t = event.changedTouches[0];
            if (t) onTouchStart(t.clientX, t.clientY);
          }}
          onTouchEnd={(event) => {
            const t = event.changedTouches[0];
            if (t) onTouchEnd(t.clientX, t.clientY);
          }}
        >
          {/* subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: `${100 / COLS}% ${100 / ROWS}%`,
            }}
          />

          {balls.map((ball) => (
            <div
              key={ball.id}
              className={[
                "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md",
                BALL_COLORS[ball.digit] ?? "bg-emerald-500",
                dead ? "opacity-40" : "",
              ].join(" ")}
              style={{
                left: `${((ball.pos.x + 0.5) / COLS) * 100}%`,
                top: `${((ball.pos.y + 0.5) / ROWS) * 100}%`,
                width: `${88 / COLS}%`,
                height: `${88 / ROWS}%`,
              }}
            >
              <span className="font-sans text-[10px] tabular-nums text-white sm:text-xs">
                {ball.digit}
              </span>
            </div>
          ))}

          {snake.map((segment, index) => {
            const isHead = index === 0;
            const size = isHead ? 92 / COLS : 80 / COLS;
            return (
              <div
                key={`s-${index}-${segment.x}-${segment.y}`}
                className={[
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors",
                  dead
                    ? "bg-rose-500"
                    : isHead
                      ? "bg-lime-300"
                      : "bg-lime-500",
                ].join(" ")}
                style={{
                  left: `${((segment.x + 0.5) / COLS) * 100}%`,
                  top: `${((segment.y + 0.5) / ROWS) * 100}%`,
                  width: `${size}%`,
                  height: `${size}%`,
                }}
              >
                {isHead && !dead ? (
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-0.5"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${
                        dir.x === 1
                          ? 0
                          : dir.x === -1
                            ? 180
                            : dir.y === 1
                              ? 90
                              : -90
                      }deg)`,
                    }}
                  >
                    <span className="size-1 rounded-full bg-zinc-900" />
                    <span className="size-1 rounded-full bg-zinc-900" />
                  </span>
                ) : null}
              </div>
            );
          })}

          {dead ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40">
              <p className="rounded-full bg-white px-3 py-1.5 text-sm text-zinc-900">
                dead
              </p>
            </div>
          ) : null}
        </div>

        <div className="mx-auto mt-4 grid w-36 grid-cols-3 gap-1.5">
          <div />
          <PadButton label="up" onClick={() => setDirection(DIRS.ArrowUp)} />
          <div />
          <PadButton label="left" onClick={() => setDirection(DIRS.ArrowLeft)} />
          <PadButton label="down" onClick={() => setDirection(DIRS.ArrowDown)} />
          <PadButton
            label="right"
            onClick={() => setDirection(DIRS.ArrowRight)}
          />
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
          onClick={startPlaying}
          className="mt-5 w-full cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
        >
          verify with otp
        </button>
      </div>
    </div>
  );
}

function PadButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs text-zinc-600 transition hover:bg-zinc-50"
    >
      {label === "up"
        ? "↑"
        : label === "down"
          ? "↓"
          : label === "left"
            ? "←"
            : "→"}
    </button>
  );
}
