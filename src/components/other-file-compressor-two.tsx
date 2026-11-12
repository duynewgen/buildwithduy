"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FILE_NAME = "nvidia_offerletter.pdf";
const FILE_SRC = "/other/nvidia-offer-letter.png";
/** upside-down full face, lips to crown (transparent png, crown at the bottom) */
export const HEAD_SRC = "/other/compressor-head.png";
/** the meme sound that plays while the head presses */
const SOUND_SRC = "/other/compressor-sound.m4a";
const MODAL_MS = 220;
const DROP_MS = 550;
const CRUSH_MS = 850;

/** 220px wide (300px box minus insets) at the letter's 768x1024 shape, so it isn't squished before the press */
const FILE_H = Math.round((220 * 1024) / 768);
const BASE = 22;
const CRUSH_H = 18;
/** compressor-head.png is 560x684 */
const HEAD_W = 280;
const HEAD_H = Math.round((684 * HEAD_W) / 560);
/**
 * the head starts hidden above the frame. at full crush its top edge
 * lands exactly on the frame's top, so the cut edge never shows.
 */
const MACHINE_H = HEAD_H + CRUSH_H + BASE;
const HEAD_TOP = -HEAD_H;
const TOUCH_TRAVEL = MACHINE_H - BASE - FILE_H;
const FULL_TRAVEL = HEAD_H;

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

type PressPhase = "idle" | "drop" | "crush";

function JobSheet({ squish }: { squish?: boolean }) {
  return (
    <img
      src={FILE_SRC}
      alt={FILE_NAME}
      className={
        squish
          ? "h-full w-full border border-zinc-200 bg-white object-fill"
          : "w-full rounded-xl border border-zinc-200 bg-white object-contain"
      }
    />
  );
}

export function HeadImage({ className = "" }: { className?: string }) {
  return (
    <img
      src={HEAD_SRC}
      alt="head"
      draggable={false}
      className={`h-full w-full object-contain object-bottom ${className}`}
    />
  );
}

export function OtherFileCompressorTwo() {
  const [mounted, setMounted] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [phase, setPhase] = useState<PressPhase>("idle");
  const [done, setDone] = useState(false);
  const [payMounted, setPayMounted] = useState(false);
  const [payActive, setPayActive] = useState(false);
  const closeTimerRef = useRef(0);
  const pressTimerRef = useRef(0);
  const payTimerRef = useRef(0);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(pressTimerRef.current);
      window.clearTimeout(payTimerRef.current);
      soundRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!modalMounted && !payMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (payMounted) closePay();
      else closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted, payMounted]);

  useEffect(() => {
    if (!modalActive) return;
    pressTimerRef.current = window.setTimeout(() => setPhase("drop"), 160);
    return () => window.clearTimeout(pressTimerRef.current);
  }, [modalActive]);

  useEffect(() => {
    if (phase !== "drop") return;
    pressTimerRef.current = window.setTimeout(() => setPhase("crush"), DROP_MS);
    return () => window.clearTimeout(pressTimerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "crush") return;
    pressTimerRef.current = window.setTimeout(() => {
      setDone(true);
    }, CRUSH_MS);
    return () => window.clearTimeout(pressTimerRef.current);
  }, [phase]);

  function playSound() {
    // started from the click so browsers allow it
    if (!soundRef.current) soundRef.current = new Audio(SOUND_SRC);
    const sound = soundRef.current;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function stopSound() {
    soundRef.current?.pause();
  }

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(pressTimerRef.current);
    setPhase("idle");
    setDone(false);
    setModalMounted(true);
    playSound();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }

  function closeModal() {
    setModalActive(false);
    stopSound();
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(pressTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setPhase("idle");
    }, MODAL_MS);
  }

  function openPay() {
    // the sound runs until download is hit
    stopSound();
    window.clearTimeout(payTimerRef.current);
    setPayMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPayActive(true));
    });
  }

  function closePay() {
    setPayActive(false);
    window.clearTimeout(payTimerRef.current);
    payTimerRef.current = window.setTimeout(() => {
      setPayMounted(false);
    }, MODAL_MS);
  }

  const crushing = phase === "crush";
  const headTravel =
    phase === "crush" ? FULL_TRAVEL : phase === "drop" ? TOUCH_TRAVEL : 0;
  const motionMs = crushing ? CRUSH_MS : DROP_MS;
  const fileHeight = crushing ? CRUSH_H : FILE_H;

  return (
    <div className="w-full max-w-sm text-zinc-900" style={scrappyFont}>
      <p className="text-3xl text-red-700">File Compressor v2</p>

      <div className="mx-auto mt-5 w-80">
        <JobSheet />
      </div>
      <p className="mt-3 text-base break-all">{FILE_NAME}</p>

      <button
        type="button"
        onClick={openModal}
        className="mt-4 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Compress
      </button>

      {mounted && modalMounted
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  modalActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={closeModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="compressor-two-title"
                className={[
                  "relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <div className="flex items-center justify-between">
                  <p id="compressor-two-title" className="text-2xl text-red-700">
                    {done ? "Compressed" : "Compressing..."}
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="close"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <div
                  className="relative mx-auto mt-4 w-[300px] max-w-full overflow-hidden"
                  style={{ height: MACHINE_H }}
                >
                  {/* the head is the press */}
                  <div
                    className="absolute left-1/2 z-10"
                    style={{
                      top: HEAD_TOP,
                      marginLeft: -HEAD_W / 2,
                      width: HEAD_W,
                      height: HEAD_H,
                      transform: `translateY(${headTravel}px)`,
                      transition: `transform ${motionMs}ms ease-in`,
                    }}
                  >
                    <HeadImage />
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 h-[22px] rounded-md bg-amber-800" />
                  <div
                    className="absolute right-10 left-10 overflow-hidden"
                    style={{
                      bottom: BASE,
                      height: fileHeight,
                      transition: crushing
                        ? `height ${CRUSH_MS}ms ease-in`
                        : "none",
                    }}
                  >
                    <div
                      className="absolute right-0 bottom-0 left-0 origin-bottom"
                      style={{
                        height: FILE_H,
                        transform: `scaleY(${fileHeight / FILE_H})`,
                        transition: crushing
                          ? `transform ${CRUSH_MS}ms ease-in`
                          : "none",
                      }}
                    >
                      <JobSheet squish />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-sm break-all">{FILE_NAME}</p>
                {done ? (
                  <button
                    type="button"
                    onClick={openPay}
                    className="mx-auto mt-4 block cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                    style={scrappyFont}
                  >
                    Download
                  </button>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && payMounted
        ? createPortal(
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  payActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={closePay}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-required-two-title"
                className={[
                  "relative z-10 w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl transition duration-200 ease-out",
                  payActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <button
                  type="button"
                  onClick={closePay}
                  className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="close"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
                <p
                  id="payment-required-two-title"
                  className="text-2xl text-red-700"
                >
                  Payment required
                </p>
                <p className="mt-4 font-sans text-5xl text-zinc-900 tabular-nums">
                  $167.99
                </p>
                <p className="mt-1 text-lg">service fee</p>
                <button
                  type="button"
                  className="mt-6 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                  style={scrappyFont}
                >
                  Pay $167.99
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
