"use client";

import { useEffect, useRef, useState } from "react";

type SeatId = "you" | "jensen" | "alice" | "kimberly";
type Phase = "ready" | "betting" | "showdown" | "payout" | "done";

type Seat = {
  id: SeatId;
  name: string;
  face?: string;
  /** seat position on the table, in % */
  x: number;
  y: number;
  chip: string;
};

const SEATS: Seat[] = [
  { id: "jensen", name: "Jensen Huang", face: "/other/ai-chip/jensen.png", x: 50, y: 15, chip: "#76b900" },
  { id: "alice", name: "Alice Huang", face: "/other/ai-chip/alice.png", x: 6, y: 47, chip: "#dc2626" },
  { id: "kimberly", name: "Kimberly Powell", face: "/other/ai-chip/kimberly.png", x: 94, y: 47, chip: "#2563eb" },
  { id: "you", name: "You", x: 50, y: 90, chip: "#18181b" },
];

/** everything is in billions of dollars */
const START: Record<SeatId, number> = {
  you: 100,
  jensen: 1200,
  alice: 60,
  kimberly: 40,
};

/** already on the table when the page opens, so it's ready to film */
const STARTING_POT = 85;

/** what everyone puts in after you act */
const CALLS: Record<Exclude<SeatId, "you">, number> = {
  alice: 15,
  kimberly: 10,
  jensen: 430,
};

/** net result of the hand. the starting pot covers the difference. */
const NET: Record<SeatId, number> = {
  you: 100,
  jensen: -430,
  alice: 10,
  kimberly: 5,
};

const FLY_MS = 650;
const CHIP_SIZE = 52;

type Chip = {
  id: number;
  color: string;
  x: number;
  y: number;
};

type Card = { rank: string; suit: string };

const HANDS: Record<SeatId, Card[]> = {
  you: [
    { rank: "A", suit: "♠" },
    { rank: "A", suit: "♣" },
  ],
  jensen: [
    { rank: "K", suit: "♥" },
    { rank: "K", suit: "♦" },
  ],
  alice: [
    { rank: "9", suit: "♠" },
    { rank: "9", suit: "♥" },
  ],
  kimberly: [
    { rank: "Q", suit: "♦" },
    { rank: "J", suit: "♦" },
  ],
};

/** fixed offsets so the starting pile renders the same on server and client */
const PILE = [
  [-15, -4], [-10, 5], [-6, -7], [-3, 2], [1, -9], [3, 6], [6, -2],
  [10, 4], [13, -6], [-12, -10], [9, -11], [-8, 10], [15, 3], [-1, 11],
];
const PILE_COLORS = ["#76b900", "#dc2626", "#2563eb", "#18181b"];

function startingPile(): Chip[] {
  return PILE.map(([dx, dy], i) => ({
    id: -1 - i,
    color: PILE_COLORS[i % PILE_COLORS.length],
    x: 50 + dx,
    y: 47 + dy,
  }));
}

/** $1200B -> $1.2T */
function money(billions: number) {
  const abs = Math.abs(billions);
  if (abs >= 1000) return `$${parseFloat((abs / 1000).toFixed(2))}T`;
  return `$${abs}B`;
}

function seatOf(id: SeatId) {
  return SEATS.find((seat) => seat.id === id)!;
}

/** how many chips to draw for a bet, so bigger bets look bigger */
function chipCount(billions: number) {
  return Math.max(2, Math.min(14, Math.round(Math.sqrt(billions) * 0.7)));
}

/** a poker chip with AI on it */
export function AiChip({
  color,
  size = 28,
  className = "",
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full shadow-md ${className}`}
      style={{
        width: size,
        height: size,
        background: `repeating-conic-gradient(${color} 0deg 30deg, #fafafa 30deg 45deg)`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full border border-white/70 font-sans font-bold text-white"
        style={{
          width: size * 0.68,
          height: size * 0.68,
          background: color,
          fontSize: size * 0.3,
        }}
      >
        AI
      </div>
    </div>
  );
}

function PlayingCard({ card, hidden }: { card: Card; hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="h-16 w-12 rounded-lg border-2 border-white bg-[repeating-linear-gradient(45deg,#1e3a8a_0_5px,#1d4ed8_5px_10px)] shadow-md sm:h-20 sm:w-14" />
    );
  }
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className={`flex h-16 w-12 flex-col items-center justify-center rounded-lg border border-zinc-300 bg-white font-sans text-xl leading-none font-semibold shadow-md sm:h-20 sm:w-14 sm:text-2xl ${red ? "text-red-600" : "text-zinc-900"}`}
    >
      <span>{card.rank}</span>
      <span>{card.suit}</span>
    </div>
  );
}

export function OtherAiChip() {
  const [stacks, setStacks] = useState<Record<SeatId, number>>(START);
  const [chips, setChips] = useState<Chip[]>(startingPile);
  const [pot, setPot] = useState(STARTING_POT);
  const [phase, setPhase] = useState<Phase>("ready");
  const chipId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  /** move chips on the next frame so the transition runs. "all" moves every chip on the table. */
  function flyTo(
    ids: number[] | "all",
    target: (i: number) => { x: number; y: number },
  ) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setChips((prev) =>
          prev.map((chip, n) => {
            const i = ids === "all" ? n : ids.indexOf(chip.id);
            return i < 0 ? chip : { ...chip, ...target(i) };
          }),
        ),
      ),
    );
  }

  /** throw a bet from a seat into the pot */
  function bet(id: SeatId, billions: number) {
    const seat = seatOf(id);
    const fresh: Chip[] = Array.from({ length: chipCount(billions) }, () => ({
      id: chipId.current++,
      color: seat.chip,
      x: seat.x,
      y: seat.y,
    }));
    setStacks((prev) => ({ ...prev, [id]: prev[id] - billions }));
    setPot((prev) => prev + billions);
    setChips((prev) => [...prev, ...fresh]);
    flyTo(
      fresh.map((chip) => chip.id),
      () => ({
        x: 50 + (Math.random() - 0.5) * 34,
        y: 46 + (Math.random() - 0.5) * 24,
      }),
    );
  }

  /** split the pot: almost everything to you, a little to alice and kimberly */
  function payout() {
    const owner = (i: number): SeatId =>
      i === 0 || i === 1 ? "alice" : i === 2 ? "kimberly" : "you";
    flyTo("all", (i) => {
      const seat = seatOf(owner(i));
      return {
        x: seat.x + (Math.random() - 0.5) * 6,
        y: seat.y - 8 + (Math.random() - 0.5) * 4,
      };
    });
  }

  function act(yourBet: number) {
    if (phase !== "ready") return;
    setPhase("betting");
    bet("you", yourBet);
    later(() => bet("alice", CALLS.alice), 450);
    later(() => bet("kimberly", CALLS.kimberly), 900);
    // jensen shoves
    later(() => bet("jensen", CALLS.jensen), 1450);
    later(() => setPhase("showdown"), 1450 + FLY_MS + 400);
    later(() => {
      setPhase("payout");
      payout();
    }, 1450 + FLY_MS + 1700);
    later(() => {
      // every bet is back with its owner plus the net result
      setStacks({
        you: START.you + NET.you,
        jensen: START.jensen + NET.jensen,
        alice: START.alice + NET.alice,
        kimberly: START.kimberly + NET.kimberly,
      });
      setPot(0);
      setChips([]);
      setPhase("done");
    }, 1450 + FLY_MS * 2 + 1900);
  }

  function reset() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setStacks(START);
    setChips(startingPile());
    setPot(STARTING_POT);
    setPhase("ready");
  }

  const reveal = phase === "showdown" || phase === "payout" || phase === "done";
  const done = phase === "done";

  return (
    <div className="w-full text-zinc-900">
      {/* top margin leaves room for jensen's result badge */}
      <div className="relative mx-auto mt-16 aspect-[4/3] w-full max-w-5xl sm:aspect-[16/10]">
        {/* the table */}
        <div className="absolute inset-[11%_10%] rounded-[50%] border-[14px] border-amber-900 bg-[radial-gradient(ellipse_at_center,#15803d,#14532d)] shadow-[inset_0_0_60px_rgba(0,0,0,0.45),0_20px_40px_rgba(0,0,0,0.2)]" />

        {/* pot */}
        {pot > 0 ? (
          <div className="absolute top-[62%] left-1/2 -translate-x-1/2 font-sans whitespace-nowrap text-white">
            <span className="rounded-full bg-black/35 px-4 py-1.5 text-base sm:text-lg">
              pot: <span className="tabular-nums">{money(pot)}</span> in AI chips
            </span>
          </div>
        ) : null}

        {/* result, in the middle of the felt once the chips are gone */}
        {done ? (
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-3xl font-bold whitespace-nowrap text-white drop-shadow-lg sm:text-5xl">
            You win {money(NET.you)}
          </div>
        ) : null}

        {/* chips */}
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${chip.x}%`,
              top: `${chip.y}%`,
              transition: `left ${FLY_MS}ms ease-out, top ${FLY_MS}ms ease-out`,
            }}
          >
            <AiChip color={chip.color} size={CHIP_SIZE} />
          </div>
        ))}

        {/* seats */}
        {SEATS.map((seat) => {
          const net = NET[seat.id];
          const winner = done && seat.id === "you";
          return (
            <div
              key={seat.id}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${seat.x}%`, top: `${seat.y}%` }}
            >
              <div className="relative">
                {seat.face ? (
                  <img
                    src={seat.face}
                    alt={seat.name}
                    draggable={false}
                    className={`h-20 w-20 rounded-full border-4 bg-zinc-100 object-cover shadow-lg sm:h-28 sm:w-28 ${done && net < 0 ? "border-red-500 grayscale" : "border-white"}`}
                  />
                ) : (
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full border-4 bg-zinc-800 font-sans text-xl text-white shadow-lg sm:h-28 sm:w-28 sm:text-2xl ${winner ? "border-yellow-400 ring-8 ring-yellow-300" : "border-white"}`}
                  >
                    you
                  </div>
                )}
                {/* result badge */}
                {done ? (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full rounded-full px-3 py-1 font-sans text-lg font-bold whitespace-nowrap text-white shadow-lg sm:text-2xl ${net < 0 ? "bg-red-600" : "bg-[#76b900]"}`}
                  >
                    {net < 0 ? "-" : "+"}
                    {money(net)}
                  </div>
                ) : null}
              </div>
              <div className="rounded-full bg-zinc-900/85 px-3 py-1 text-center font-sans text-sm whitespace-nowrap text-white sm:text-base">
                {seat.name} ·{" "}
                {/* after the hand, show what each player won or lost */}
                <span
                  className={`tabular-nums ${done ? (net < 0 ? "font-semibold text-red-400" : "font-semibold text-lime-300") : ""}`}
                >
                  {done ? `${net < 0 ? "-" : "+"}${money(net)}` : money(stacks[seat.id])}
                </span>
              </div>
              <div className="flex gap-1.5">
                {HANDS[seat.id].map((card, i) => (
                  <PlayingCard key={i} card={card} hidden={seat.id !== "you" && !reveal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* your actions */}
      <div className="mt-20 flex flex-wrap items-center justify-center gap-3 font-sans sm:mt-24">
        {phase === "ready" ? (
          <>
            <button
              type="button"
              onClick={() => act(10)}
              className="cursor-pointer rounded-full bg-zinc-900 px-7 py-3 text-lg text-white hover:bg-zinc-800"
            >
              Call {money(10)}
            </button>
            <button
              type="button"
              onClick={() => act(25)}
              className="cursor-pointer rounded-full bg-[#76b900] px-7 py-3 text-lg text-white hover:brightness-95"
            >
              Raise {money(25)}
            </button>
            <button
              type="button"
              onClick={() => act(START.you)}
              className="cursor-pointer rounded-full bg-red-600 px-7 py-3 text-lg text-white hover:bg-red-700"
            >
              All in
            </button>
          </>
        ) : null}
        {done ? (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-full bg-zinc-900 px-7 py-3 text-lg text-white hover:bg-zinc-800"
          >
            Deal again
          </button>
        ) : null}
      </div>
    </div>
  );
}
