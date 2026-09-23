"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Scissors } from "lucide-react";

type Phase = "checkout" | "cutting";
type Point = { x: number; y: number };
type CutStage = "ready" | "cutting" | "split" | "keep" | "thanks";

const TOTAL = 20;
const BOARD_MS = 280;

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function angleDeg(a: Point, b: Point) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function extendToEdges(a: Point, b: Point): [Point, Point] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) {
    return [
      { x: 0.5, y: 0 },
      { x: 0.5, y: 1 },
    ];
  }

  const hits: Point[] = [];
  const tryEdge = (t: number, x: number, y: number) => {
    if (!Number.isFinite(t)) return;
    if (x < -0.002 || x > 1.002 || y < -0.002 || y > 1.002) return;
    hits.push({
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    });
  };

  if (Math.abs(dx) > 1e-8) {
    tryEdge((0 - a.x) / dx, 0, a.y + ((0 - a.x) / dx) * dy);
    tryEdge((1 - a.x) / dx, 1, a.y + ((1 - a.x) / dx) * dy);
  }
  if (Math.abs(dy) > 1e-8) {
    tryEdge((0 - a.y) / dy, a.x + ((0 - a.y) / dy) * dx, 0);
    tryEdge((1 - a.y) / dy, a.x + ((1 - a.y) / dy) * dx, 1);
  }

  const unique: Point[] = [];
  for (const hit of hits) {
    if (!unique.some((p) => Math.hypot(p.x - hit.x, p.y - hit.y) < 0.02)) {
      unique.push(hit);
    }
  }

  if (unique.length >= 2) {
    let best: [Point, Point] = [unique[0]!, unique[1]!];
    let bestD = dist(best[0], best[1]);
    for (let i = 0; i < unique.length; i++) {
      for (let j = i + 1; j < unique.length; j++) {
        const d = dist(unique[i]!, unique[j]!);
        if (d > bestD) {
          bestD = d;
          best = [unique[i]!, unique[j]!];
        }
      }
    }
    return best;
  }

  return [
    { x: 0.5, y: 0 },
    { x: 0.5, y: 1 },
  ];
}

function sideOfLine(a: Point, b: Point, p: Point) {
  return Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
}

function halfPolygons(a: Point, b: Point): [string, string] {
  const [e0, e1] = extendToEdges(a, b);
  const corners: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];

  const left: Point[] = [e0, e1];
  const right: Point[] = [e0, e1];

  for (const corner of corners) {
    const s = sideOfLine(e0, e1, corner);
    if (s >= 0) left.push(corner);
    if (s <= 0) right.push(corner);
  }

  const order = (pts: Point[]) => {
    const cx = pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
    const cy = pts.reduce((sum, p) => sum + p.y, 0) / pts.length;
    return [...pts].sort(
      (p, q) =>
        Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx),
    );
  };

  const toPoly = (pts: Point[]) =>
    order(pts)
      .map((p) => `${p.x * 100}% ${p.y * 100}%`)
      .join(", ");

  return [`polygon(${toPoly(left)})`, `polygon(${toPoly(right)})`];
}

function DollarBillFace() {
  return (
    <>
      <div className="absolute inset-[6%] rounded-lg border border-dashed border-emerald-800/35" />
      <div className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-800/40 bg-emerald-100/50 font-sans text-xs tabular-nums text-emerald-900 sm:left-3 sm:size-10 sm:text-sm">
        20
      </div>
      <div className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-800/40 bg-emerald-100/50 font-sans text-xs tabular-nums text-emerald-900 sm:right-3 sm:size-10 sm:text-sm">
        20
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
        <p className="font-display text-base tracking-tight text-emerald-950 sm:text-lg">
          united states
        </p>
        <p className="mt-0.5 text-[9px] tracking-wide text-emerald-900/70 sm:text-[10px]">
          federal reserve note
        </p>
        <p className="mt-1.5 font-sans text-xl tabular-nums text-emerald-950 sm:text-2xl">
          {money(TOTAL)}
        </p>
      </div>
    </>
  );
}

export function PaymentSplit() {
  const [phase, setPhase] = useState<Phase>("checkout");
  const [boardActive, setBoardActive] = useState(false);
  const [stage, setStage] = useState<CutStage>("ready");
  const [cursor, setCursor] = useState<Point>({ x: 0.5, y: 0.14 });
  const [start, setStart] = useState<Point | null>(null);
  const [end, setEnd] = useState<Point | null>(null);
  const [cutProgress, setCutProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [inside, setInside] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const stageTimerRef = useRef(0);
  const startRef = useRef<Point | null>(null);
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    return () => window.clearTimeout(stageTimerRef.current);
  }, []);

  function startCutting() {
    window.clearTimeout(stageTimerRef.current);
    doneRef.current = false;
    startRef.current = null;
    progressRef.current = 0;
    setStage("ready");
    setCursor({ x: 0.5, y: 0.14 });
    setStart(null);
    setEnd(null);
    setCutProgress(0);
    setDragging(false);
    setInside(false);
    setBoardActive(false);
    setPhase("cutting");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setBoardActive(true));
    });
  }

  function toBoardLocal(clientX: number, clientY: number): Point | null {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }

  /** Bill-local 0–1. Clamps so a stroke that starts just outside snaps to the note edge. */
  function toBillLocal(clientX: number, clientY: number): Point | null {
    const bill = billRef.current;
    if (!bill) return null;
    const rect = bill.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }

  function nearBill(clientX: number, clientY: number, pad = 12) {
    const bill = billRef.current;
    if (!bill) return false;
    const rect = bill.getBoundingClientRect();
    return (
      clientX >= rect.left - pad &&
      clientX <= rect.right + pad &&
      clientY >= rect.top - pad &&
      clientY <= rect.bottom + pad
    );
  }

  function pixelDistOnBill(a: Point, b: Point) {
    const bill = billRef.current;
    if (!bill) return dist(a, b);
    const rect = bill.getBoundingClientRect();
    return Math.hypot((b.x - a.x) * rect.width, (b.y - a.y) * rect.height);
  }

  function requiredPixels() {
    const bill = billRef.current;
    if (!bill) return 100;
    const rect = bill.getBoundingClientRect();
    return Math.min(rect.width, rect.height) * 0.72;
  }

  function edgeFlags(p: Point, tol = 0.04) {
    return {
      left: p.x <= tol,
      right: p.x >= 1 - tol,
      top: p.y <= tol,
      bottom: p.y >= 1 - tol,
    };
  }

  function crossedBill(a: Point, b: Point) {
    const ea = edgeFlags(a);
    const eb = edgeFlags(b);
    const aEdge = ea.left || ea.right || ea.top || ea.bottom;
    const bEdge = eb.left || eb.right || eb.top || eb.bottom;
    if (!aEdge || !bEdge) return false;
    return (
      (ea.left && eb.right) ||
      (ea.right && eb.left) ||
      (ea.top && eb.bottom) ||
      (ea.bottom && eb.top) ||
      (ea.left && (eb.top || eb.bottom || eb.right)) ||
      (ea.right && (eb.top || eb.bottom || eb.left)) ||
      (ea.top && (eb.left || eb.right || eb.bottom)) ||
      (ea.bottom && (eb.left || eb.right || eb.top))
    );
  }

  function finishCut(finalEnd: Point) {
    if (doneRef.current) return;
    doneRef.current = true;
    setEnd(finalEnd);
    setCutProgress(1);
    setDragging(false);
    setStage("split");

    window.clearTimeout(stageTimerRef.current);
    stageTimerRef.current = window.setTimeout(() => {
      setStage("keep");
      stageTimerRef.current = window.setTimeout(() => {
        setStage("thanks");
      }, 750);
    }, 700);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (doneRef.current) return;
    if (stage !== "ready" && stage !== "cutting") return;
    if (!nearBill(event.clientX, event.clientY)) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const boardPoint = toBoardLocal(event.clientX, event.clientY);
    const billPoint = toBillLocal(event.clientX, event.clientY);
    if (!boardPoint || !billPoint) return;

    setInside(true);
    setCursor(boardPoint);
    startRef.current = billPoint;
    progressRef.current = 0;
    setStart(billPoint);
    setEnd(billPoint);
    setCutProgress(0);
    setDragging(true);
    setStage("cutting");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const boardPoint = toBoardLocal(event.clientX, event.clientY);
    if (boardPoint) {
      setCursor(boardPoint);
      setInside(true);
    }

    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (doneRef.current || !startRef.current) return;

    const billPoint = toBillLocal(event.clientX, event.clientY);
    if (!billPoint) return;

    setEnd(billPoint);
    const next = Math.min(
      1,
      pixelDistOnBill(startRef.current, billPoint) / requiredPixels(),
    );
    progressRef.current = next;
    setCutProgress(next);

    if (next >= 0.97 || crossedBill(startRef.current, billPoint)) {
      finishCut(billPoint);
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    if (!doneRef.current) {
      startRef.current = null;
      progressRef.current = 0;
      setStart(null);
      setEnd(null);
      setCutProgress(0);
      setStage("ready");
    }
  }

  const cutStart = start;
  const cutEnd = end;
  const scissorsAngle =
    dragging && cutStart && cutEnd && cutProgress > 0.04
      ? angleDeg(cutStart, cutEnd) + 90
      : -90;

  const [clipA, clipB] =
    cutStart && cutEnd ? halfPolygons(cutStart, cutEnd) : ["none", "none"];

  const sep =
    cutStart && cutEnd
      ? (() => {
          const [e0, e1] = extendToEdges(cutStart, cutEnd);
          const dx = e1.x - e0.x;
          const dy = e1.y - e0.y;
          const len = Math.hypot(dx, dy) || 1;
          return { x: (-dy / len) * 32, y: (dx / len) * 32 };
        })()
      : { x: 28, y: 0 };

  const interactive = stage === "ready" || stage === "cutting";

  if (phase === "cutting") {
    return (
      <div
        className={[
          "mx-auto w-full max-w-md text-center transition duration-300 ease-out",
          boardActive
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        ].join(" ")}
        style={{ transitionDuration: `${BOARD_MS}ms` }}
      >
        <p className="min-h-5 text-sm text-zinc-500">
          {interactive ? "drag across the bill to split the check" : "\u00a0"}
        </p>

        <div
          ref={boardRef}
          className={[
            "relative mx-auto mt-5 aspect-[4/3] w-full max-w-md touch-none select-none overflow-hidden rounded-3xl border border-[#c4b49a]",
            "bg-[linear-gradient(145deg,#efe6d6_0%,#e0d3bc_48%,#d6c7a8_100%)]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-12px_24px_rgba(120,90,40,0.08),0_12px_28px_rgba(0,0,0,0.08)]",
            interactive ? "cursor-none" : "pointer-events-none",
          ].join(" ")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => setInside(true)}
          onPointerLeave={() => {
            if (!dragging) setInside(false);
          }}
          role="application"
          aria-label="cutting board. drag scissors across the bill to split."
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(92deg, transparent 0 14px, rgba(110,80,40,0.07) 14px 15px)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10">
            <div
              ref={billRef}
              className="relative aspect-[2.1/1] w-full max-w-sm"
            >
              {interactive ? (
                <div className="absolute inset-0 overflow-hidden rounded-xl border-2 border-emerald-800/40 bg-[#c5e1a5] shadow-lg">
                  <DollarBillFace />
                  {cutStart && cutEnd && cutProgress > 0.02 ? (
                    <svg
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      viewBox="0 0 1 1"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1={cutStart.x}
                        y1={cutStart.y}
                        x2={cutEnd.x}
                        y2={cutEnd.y}
                        stroke="rgba(24,24,27,0.8)"
                        strokeWidth={0.014}
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : null}
                </div>
              ) : null}

              {stage === "split" ? (
                <div
                  className="absolute inset-0 overflow-hidden rounded-xl border-2 border-emerald-800/40 bg-[#c5e1a5] shadow-lg"
                  style={
                    {
                      clipPath: clipA,
                      ["--split-x" as string]: `${-sep.x * 1.8}px`,
                      ["--split-y" as string]: `${-sep.y * 1.8}px`,
                      animation: "split-half-out 0.65s ease-in forwards",
                      transform: `translate(${-sep.x}px, ${-sep.y}px)`,
                    } as React.CSSProperties
                  }
                >
                  <DollarBillFace />
                </div>
              ) : null}

              {stage === "split" || stage === "keep" || stage === "thanks" ? (
                <div
                  className={[
                    "absolute inset-0 overflow-hidden rounded-xl border-2 border-emerald-800/40 bg-[#c5e1a5] shadow-lg transition duration-700 ease-out",
                    stage === "split"
                      ? ""
                      : "-translate-y-14 sm:-translate-y-16",
                  ].join(" ")}
                  style={
                    stage === "split"
                      ? { clipPath: clipB, transform: `translate(${sep.x}px, ${sep.y}px)` }
                      : { clipPath: clipB }
                  }
                >
                  <DollarBillFace />
                </div>
              ) : null}
            </div>
          </div>

          <p
            className={[
              "pointer-events-none absolute inset-x-0 bottom-7 text-center text-sm text-zinc-800 transition duration-500",
              stage === "thanks"
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0",
            ].join(" ")}
          >
            check splitted. thank you
          </p>

          {(interactive && (inside || dragging)) ||
          (interactive && stage === "ready") ? (
            <div
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${cursor.x * 100}%`,
                top: `${cursor.y * 100}%`,
              }}
            >
              <div
                className={[
                  "flex size-12 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-md",
                  dragging ? "scale-110" : "",
                ].join(" ")}
                style={{ transform: `rotate(${scissorsAngle}deg)` }}
              >
                <Scissors className="h-5 w-5 text-zinc-800" strokeWidth={2} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
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
            <p className="truncate text-sm text-zinc-900">dinner for two</p>
            <p className="mt-0.5 text-sm text-zinc-500">you + one friend</p>
          </div>
          <p className="shrink-0 font-sans text-sm tabular-nums text-zinc-900">
            {money(TOTAL)}
          </p>
        </div>

        <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-zinc-500">subtotal</span>
            <span className="font-sans tabular-nums text-zinc-900">
              {money(TOTAL)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-zinc-500">tax</span>
            <span className="font-sans tabular-nums text-zinc-900">$0.00</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-zinc-900">total</span>
            <span className="font-sans text-base tabular-nums text-zinc-900">
              {money(TOTAL)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={startCutting}
          className="mt-5 w-full cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
        >
          split bill
        </button>
      </div>
    </div>
  );
}
