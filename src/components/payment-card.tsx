"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "checkout" | "paid";

type Suit = "spades" | "hearts" | "diamonds" | "clubs";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

type PlayingCard = {
  id: string;
  rank: Rank;
  suit: Suit;
};

const TARGET = 10;
const TABLE_SIZE = 10;
const MODAL_MS = 220;

const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];

const SUIT_MARK: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

function cardValue(rank: Rank): number {
  if (rank === "A") return 1;
  if (rank === "J" || rank === "Q" || rank === "K") return 10;
  return Number(rank);
}

function isRed(suit: Suit) {
  return suit === "hearts" || suit === "diamonds";
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

function dealTable(): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}-${suit}`, rank, suit });
    }
  }
  return shuffle(deck).slice(0, TABLE_SIZE);
}

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function PlayingCardFace({
  card,
  compact = false,
}: {
  card: PlayingCard;
  compact?: boolean;
}) {
  const red = isRed(card.suit);
  return (
    <div
      className={[
        "relative flex shrink-0 flex-col justify-between rounded-lg border bg-white shadow-sm",
        compact
          ? "h-14 w-10 p-1 sm:h-16 sm:w-11"
          : "h-16 w-11 p-1 sm:h-20 sm:w-14 sm:p-1.5",
        red ? "border-rose-200 text-rose-700" : "border-zinc-300 text-zinc-900",
      ].join(" ")}
      aria-label={`${card.rank} of ${card.suit}, $${cardValue(card.rank)}`}
    >
      <div className="leading-none">
        <p
          className={[
            "font-sans tabular-nums",
            compact ? "text-[9px]" : "text-[10px] sm:text-xs",
          ].join(" ")}
        >
          {card.rank}
        </p>
        <p
          className={
            compact ? "text-[9px] leading-none" : "text-[10px] leading-none"
          }
        >
          {SUIT_MARK[card.suit]}
        </p>
      </div>
      <p
        className={[
          "self-center leading-none",
          compact ? "text-sm" : "text-base sm:text-xl",
        ].join(" ")}
      >
        {SUIT_MARK[card.suit]}
      </p>
      <div className="rotate-180 leading-none">
        <p
          className={[
            "font-sans tabular-nums",
            compact ? "text-[9px]" : "text-[10px] sm:text-xs",
          ].join(" ")}
        >
          {card.rank}
        </p>
        <p
          className={
            compact ? "text-[9px] leading-none" : "text-[10px] leading-none"
          }
        >
          {SUIT_MARK[card.suit]}
        </p>
      </div>
    </div>
  );
}

function CardBack({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm",
        compact
          ? "h-14 w-10 sm:h-16 sm:w-11"
          : "h-16 w-11 sm:h-20 sm:w-14",
      ].join(" ")}
      aria-hidden
    >
      <div className="flex h-[85%] w-[78%] items-center justify-center rounded-md border border-zinc-600 bg-[repeating-linear-gradient(135deg,#3f3f46_0_2px,transparent_2px_6px)]">
        <span
          className={compact ? "text-xs text-zinc-400" : "text-sm text-zinc-400"}
        >
          ♠
        </span>
      </div>
    </div>
  );
}

export function PaymentCard() {
  const [phase, setPhase] = useState<Phase>("checkout");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [table, setTable] = useState<PlayingCard[]>(() => dealTable());
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [paidTotal, setPaidTotal] = useState(TARGET);
  const [lastPickId, setLastPickId] = useState<string | null>(null);
  const [pickingLocked, setPickingLocked] = useState(false);
  const closeTimerRef = useRef(0);
  const finishTimerRef = useRef(0);

  const total = hand.reduce((sum, card) => sum + cardValue(card.rank), 0);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pickingLocked) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted, pickingLocked]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
    setTable(dealTable());
    setHand([]);
    setLastPickId(null);
    setPaidTotal(TARGET);
    setPickingLocked(false);
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }

  function closeModal(after?: () => void) {
    setModalActive(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setHand([]);
      setLastPickId(null);
      setPickingLocked(false);
      after?.();
    }, MODAL_MS);
  }

  function pickCard(card: PlayingCard) {
    if (!modalActive || pickingLocked) return;
    if (!table.some((c) => c.id === card.id)) return;

    const nextHand = [...hand, card];
    const nextTotal = nextHand.reduce(
      (sum, item) => sum + cardValue(item.rank),
      0,
    );

    setTable((prev) => prev.filter((c) => c.id !== card.id));
    setHand(nextHand);
    setLastPickId(card.id);

    if (nextTotal >= TARGET) {
      setPickingLocked(true);
      setPaidTotal(nextTotal);
      // show confirm behind the modal, then fade the modal away onto it
      setPhase("paid");
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = window.setTimeout(() => {
        closeModal();
      }, 450);
    }
  }

  return (
    <>
      {phase === "paid" ? (
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900">
              {money(paidTotal)}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              {paidTotal > TARGET
                ? `menu was ${money(TARGET)}. your cards said otherwise.`
                : "you're all set. thank you for your purchase."}
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-sm text-left">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm tracking-wide text-zinc-500">your order</p>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                <Image
                  src="/payment/coffee.jpg"
                  alt="coffee"
                  fill
                  className="object-cover"
                  sizes="64px"
                  priority
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-900">oat milk latte</p>
                <p className="mt-0.5 text-sm text-zinc-500">qty 1</p>
              </div>
              <p className="shrink-0 font-sans text-sm tabular-nums text-zinc-900">
                {money(TARGET)}
              </p>
            </div>

            <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">subtotal</span>
                <span className="font-sans tabular-nums text-zinc-900">
                  {money(TARGET)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">tax</span>
                <span className="font-sans tabular-nums text-zinc-900">$0.00</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-zinc-900">total</span>
                <span className="font-sans text-base tabular-nums text-zinc-900">
                  {money(TARGET)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-zinc-900 text-sm tracking-wide text-white transition hover:bg-zinc-800 active:bg-zinc-950"
            >
              pay with card
            </button>
          </div>
        </div>
      )}

      {mounted && modalMounted
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  modalActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={() => {
                  if (!pickingLocked) closeModal();
                }}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pay-with-card-title"
                className={[
                  "relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
                  <div>
                    <p
                      id="pay-with-card-title"
                      className="text-sm tracking-wide text-zinc-900"
                    >
                      pay with card
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      flip face-down cards until you hit ${TARGET} or more.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!pickingLocked) closeModal();
                    }}
                    className="cursor-pointer rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40"
                    aria-label="close"
                    disabled={pickingLocked}
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="bg-[#0f3d2e] px-4 py-4 sm:px-5 sm:py-5">
                  <div className="mb-4 text-center">
                    <p className="font-sans text-2xl tabular-nums tracking-wide text-white sm:text-3xl">
                      ${total} / ${TARGET}
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/70">
                      that sum is what you pay
                    </p>
                  </div>

                  <p className="mb-2 text-xs tracking-wide text-emerald-100/70">
                    your hand
                  </p>
                  <div className="mb-4 flex min-h-16 items-end justify-center gap-1.5 overflow-x-auto sm:min-h-20 sm:gap-2">
                    {hand.length === 0 ? (
                      <p className="py-5 text-sm text-emerald-100/60">
                        empty — pick below
                      </p>
                    ) : (
                      hand.map((card, index) => (
                        <div
                          key={`${card.id}-${index}`}
                          className={
                            card.id === lastPickId && index === hand.length - 1
                              ? "animate-[fade-up_0.28s_ease-out]"
                              : undefined
                          }
                        >
                          <PlayingCardFace card={card} />
                        </div>
                      ))
                    )}
                  </div>

                  <p className="mb-2 text-xs tracking-wide text-emerald-100/70">
                    pick a card
                  </p>
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {table.map((card, index) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => pickCard(card)}
                        disabled={pickingLocked}
                        className="cursor-pointer justify-self-center transition hover:-translate-y-1 active:translate-y-0 disabled:cursor-default disabled:opacity-60"
                        aria-label={`face-down card ${index + 1}`}
                      >
                        <CardBack compact />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
