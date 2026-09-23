"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "login" | "checked-in";

const PHONE = "0123456789";
const MODAL_MS = 220;
const OTP_LENGTH = 6;

/** Digits clockwise from near the top toward the finger stop. */
const DIAL_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;
const HOLE_STEP = 30;
/** Rest angle of digit 1, degrees clockwise from 12 o'clock. */
const FIRST_ANGLE = -150;
const STOP_ANGLE = FIRST_ANGLE + DIAL_DIGITS.length * HOLE_STEP;

function digitRestAngle(index: number) {
  return FIRST_ANGLE + index * HOLE_STEP;
}

function requiredRotation(index: number) {
  return STOP_ANGLE - digitRestAngle(index);
}

function polar(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
}

export function AuthOtpTwo() {
  const [phase, setPhase] = useState<Phase>("login");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [entered, setEntered] = useState("");
  const [rotation, setRotation] = useState(0);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);
  const finishTimerRef = useRef(0);
  const animTimerRef = useRef(0);
  const enteredRef = useRef("");

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(finishTimerRef.current);
      window.clearTimeout(animTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted, busy]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
    window.clearTimeout(animTimerRef.current);
    enteredRef.current = "";
    setEntered("");
    setRotation(0);
    setBusy(false);
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
      enteredRef.current = "";
      setEntered("");
      setRotation(0);
      setBusy(false);
      after?.();
    }, MODAL_MS);
  }

  function finishIfComplete(next: string) {
    if (next.length < OTP_LENGTH) return;
    setPhase("checked-in");
    window.clearTimeout(finishTimerRef.current);
    finishTimerRef.current = window.setTimeout(() => {
      closeModal();
    }, 450);
  }

  function dialDigit(index: number) {
    if (busy || enteredRef.current.length >= OTP_LENGTH) return;
    if (phase === "checked-in") return;

    const target = requiredRotation(index);
    const outMs = Math.max(280, Math.min(700, target * 2.2));
    const backMs = 380;

    setBusy(true);
    setRotation(target);

    window.clearTimeout(animTimerRef.current);
    animTimerRef.current = window.setTimeout(() => {
      setRotation(0);
      animTimerRef.current = window.setTimeout(() => {
        const digit = DIAL_DIGITS[index]!;
        const next = (enteredRef.current + String(digit)).slice(0, OTP_LENGTH);
        enteredRef.current = next;
        setEntered(next);
        setBusy(false);
        finishIfComplete(next);
      }, backMs);
    }, outMs);
  }

  return (
    <>
      {phase === "checked-in" ? (
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-600">you&apos;re checked in</p>
          </div>
        </div>
      ) : (
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
              onClick={openModal}
              className="mt-5 w-full cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
            >
              verify with otp
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
                  if (!busy) closeModal();
                }}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="otp-two-title"
                className={[
                  "relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      id="otp-two-title"
                      className="text-sm tracking-wide text-zinc-900"
                    >
                      enter otp
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!busy) closeModal();
                      }}
                      className="cursor-pointer rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40"
                      aria-label="close"
                      disabled={busy}
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="mt-4 flex justify-center gap-1.5">
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                      <div
                        key={i}
                        className={[
                          "flex h-9 w-7 items-center justify-center rounded-lg border font-sans text-sm tabular-nums",
                          "border-zinc-200 text-zinc-900",
                          entered[i]
                            ? "bg-zinc-50"
                            : "bg-white text-zinc-300",
                        ].join(" ")}
                      >
                        {entered[i] ?? "·"}
                      </div>
                    ))}
                  </div>

                  <div className="mx-auto mt-5 w-full max-w-[17rem]">
                    <RotaryPhone
                      rotation={rotation}
                      busy={busy}
                      onDial={dialDigit}
                    />
                  </div>

                  <p className="mt-3 text-center text-xs text-zinc-400">
                    tap a number to dial
                  </p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function RotaryPhone({
  rotation,
  busy,
  onDial,
}: {
  rotation: number;
  busy: boolean;
  onDial: (index: number) => void;
}) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full select-none">
      <div className="absolute left-[12%] right-[12%] top-[2%] z-10 flex items-start justify-between">
        <div className="h-10 w-8 rounded-full bg-[#3a3530] shadow-md" />
        <div className="mx-1 mt-2 h-3 flex-1 rounded-full bg-[#2f2b27]" />
        <div className="h-10 w-8 rounded-full bg-[#3a3530] shadow-md" />
      </div>

      <div
        className={[
          "absolute inset-x-[6%] bottom-[2%] top-[10%] overflow-hidden rounded-[2rem]",
          "border border-[#c4b49a]",
          "bg-[linear-gradient(160deg,#f3ead9_0%,#e4d5bc_45%,#d4c2a4_100%)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_12px_28px_rgba(0,0,0,0.12)]",
        ].join(" ")}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 45%)",
          }}
        />

        <div className="absolute left-1/2 top-3 h-1.5 w-10 -translate-x-1/2 rounded-full bg-[#b7a68a]/30" />

        <div className="absolute left-1/2 top-[46%] w-[78%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-[8%] rounded-full bg-[#2a2622] shadow-inner" />

            <div
              className="absolute inset-0 transition-transform"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration:
                  rotation > 0
                    ? `${Math.max(280, Math.min(700, rotation * 2.2))}ms`
                    : "380ms",
                transitionTimingFunction:
                  rotation > 0
                    ? "cubic-bezier(0.25, 0.1, 0.25, 1)"
                    : "cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="#d8cbb6"
                  stroke="#a89478"
                  strokeWidth="1.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46.5"
                  fill="none"
                  stroke="#efe6d6"
                  strokeWidth="0.6"
                  opacity="0.7"
                />
                {DIAL_DIGITS.map((digit, index) => {
                  const hole = polar(33, digitRestAngle(index));
                  return (
                    <circle
                      key={digit}
                      cx={hole.x}
                      cy={hole.y}
                      r="8"
                      fill="#1c1917"
                      stroke="#0c0a09"
                      strokeWidth="0.4"
                    />
                  );
                })}
                <circle
                  cx="50"
                  cy="50"
                  r="13"
                  fill="#cfc0a8"
                  stroke="#a89478"
                  strokeWidth="1"
                />
                <circle cx="50" cy="50" r="3.2" fill="#5c5348" />
              </svg>

              {DIAL_DIGITS.map((digit, index) => {
                const hole = polar(33, digitRestAngle(index));
                return (
                  <button
                    key={digit}
                    type="button"
                    aria-label={`dial ${digit}`}
                    disabled={busy}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full disabled:cursor-default"
                    style={{
                      left: `${hole.x}%`,
                      top: `${hole.y}%`,
                      width: "17%",
                      height: "17%",
                    }}
                    onClick={() => onDial(index)}
                  >
                    <span className="pointer-events-none font-sans text-xs tabular-nums text-[#f5f0e8] sm:text-sm">
                      {digit}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {(() => {
                  const tip = polar(46, STOP_ANGLE - 4);
                  const base = polar(38, STOP_ANGLE + 8);
                  const wing = polar(42, STOP_ANGLE + 14);
                  return (
                    <path
                      d={`M ${base.x} ${base.y} L ${tip.x} ${tip.y} L ${wing.x} ${wing.y} Z`}
                      fill="#8a7a62"
                      stroke="#5c5348"
                      strokeWidth="0.5"
                    />
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
          <div className="h-8 w-14 rounded-full border border-[#b7a68a]/60 bg-[#e8dcc8]" />
          <div className="grid grid-cols-4 gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="size-1 rounded-full bg-[#b7a68a]/70" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
