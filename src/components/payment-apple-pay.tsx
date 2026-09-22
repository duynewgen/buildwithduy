"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";

type Phase = "checkout" | "catching" | "paid";

type FallingFruit = {
  id: number;
  emoji: string;
  isApple: boolean;
  x: number;
  y: number;
  speed: number;
  drift: number;
  size: number;
  caught?: boolean;
};

const TOTAL_DOLLARS = 4;
const OTHER_FRUITS = ["🍌", "🍊", "🍇", "🍐", "🍉", "🍋", "🍑", "🍒"];

function randomFruit(id: number): FallingFruit {
  const isApple = Math.random() < 0.38;
  return {
    id,
    emoji: isApple
      ? "🍎"
      : OTHER_FRUITS[Math.floor(Math.random() * OTHER_FRUITS.length)]!,
    isApple,
    x: 8 + Math.random() * 84,
    y: -12 - Math.random() * 30,
    speed: 18 + Math.random() * 22,
    drift: (Math.random() - 0.5) * 10,
    size: 1.6 + Math.random() * 0.7,
  };
}

export function PaymentApplePay() {
  const [phase, setPhase] = useState<Phase>("checkout");
  const [caught, setCaught] = useState(0);
  const [fruits, setFruits] = useState<FallingFruit[]>([]);
  const [missFlash, setMissFlash] = useState(false);
  const idRef = useRef(0);
  const caughtRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  caughtRef.current = caught;

  const startCatching = useEffectEvent(() => {
    caughtRef.current = 0;
    setCaught(0);
    idRef.current = 0;
    const starter: FallingFruit[] = [];
    for (let i = 0; i < 6; i++) {
      idRef.current += 1;
      starter.push(randomFruit(idRef.current));
    }
    setFruits(starter);
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

      setFruits((prev) => {
        let next = prev
          .map((fruit) => {
            if (fruit.caught) return fruit;
            return {
              ...fruit,
              y: fruit.y + fruit.speed * dt,
              x: fruit.x + fruit.drift * dt,
            };
          })
          .filter((fruit) => fruit.y < 118);

        while (spawnAccrual > 0.55) {
          spawnAccrual -= 0.55;
          idRef.current += 1;
          next = [...next, randomFruit(idRef.current)];
        }

        const liveApples = next.filter((f) => f.isApple && !f.caught).length;
        if (liveApples < 2) {
          idRef.current += 1;
          next = [
            ...next,
            {
              ...randomFruit(idRef.current),
              isApple: true,
              emoji: "🍎",
              x: 12 + Math.random() * 76,
              y: -10 - Math.random() * 20,
            },
          ];
        }

        return next;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  function onFruitClick(fruit: FallingFruit) {
    if (phaseRef.current !== "catching" || fruit.caught) return;

    if (!fruit.isApple) {
      setMissFlash(true);
      window.setTimeout(() => setMissFlash(false), 220);
      return;
    }

    setFruits((prev) => prev.filter((f) => f.id !== fruit.id));

    const next = caughtRef.current + 1;
    caughtRef.current = next;
    setCaught(next);

    if (next >= TOTAL_DOLLARS) {
      window.setTimeout(() => {
        setPhase("paid");
        setFruits([]);
      }, 280);
    }
  }

  if (phase === "checkout") {
    return (
      <div className="mx-auto w-full max-w-sm text-left">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm tracking-wide text-zinc-500">your order</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <Image
                src="/payment/pencil.jpg"
                alt="pencil"
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-900">pencil</p>
              <p className="mt-0.5 text-sm text-zinc-500">qty 1</p>
            </div>
            <p className="shrink-0 font-sans text-sm tabular-nums text-zinc-900">
              ${TOTAL_DOLLARS}.00
            </p>
          </div>

          <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">subtotal</span>
              <span className="font-sans tabular-nums text-zinc-900">
                ${TOTAL_DOLLARS}.00
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">tax</span>
              <span className="font-sans tabular-nums text-zinc-900">$0.00</span>
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-zinc-900">total</span>
              <span className="font-sans text-base tabular-nums text-zinc-900">
                ${TOTAL_DOLLARS}.00
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={startCatching}
            className="mt-6 w-full cursor-pointer transition hover:opacity-90 active:opacity-80"
            aria-label="buy with apple pay"
          >
            <Image
              src="/payment/buy-with-apple-pay.png"
              alt=""
              width={343}
              height={50}
              className="h-12 w-full object-contain"
              draggable={false}
              priority
            />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "paid") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900">
            ${TOTAL_DOLLARS}.00
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            you&apos;re all set. thank you for your purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900 sm:text-4xl">
        ${caught} / ${TOTAL_DOLLARS}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        tap only the apples. each apple is $1.
      </p>

      <div
        className={[
          "relative mt-5 h-[min(52vh,22rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-sky-100 to-emerald-100",
          missFlash ? "ring-2 ring-red-400" : "",
        ].join(" ")}
        role="application"
        aria-label="falling fruits. tap apples to pay."
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-amber-800/30 to-transparent" />

        {fruits.map((fruit) => (
          <button
            key={fruit.id}
            type="button"
            disabled={fruit.caught}
            onClick={() => onFruitClick(fruit)}
            className={[
              "absolute -translate-x-1/2 cursor-pointer select-none transition-opacity duration-200",
              fruit.caught ? "pointer-events-none scale-125 opacity-0" : "",
            ].join(" ")}
            style={{
              left: `${fruit.x}%`,
              top: `${fruit.y}%`,
              fontSize: `${fruit.size}rem`,
            }}
            aria-label={fruit.isApple ? "apple" : "other fruit"}
          >
            <span aria-hidden>{fruit.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
