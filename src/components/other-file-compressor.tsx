"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FILE_NAME = "mcdonalds_job-application.pdf";
const FILE_SRC = "/other/mcdonalds-job-application.png";
const MODAL_MS = 220;
const DROP_MS = 500;
const CRUSH_MS = 700;

const FILE_H = 285;
const BASE = 28;
const PLATE_H = 18;
const PLATE_TOP = 56;
const CRUSH_H = 22;
const DROP_GAP = 130;
const MACHINE_H = BASE + FILE_H + DROP_GAP + PLATE_H + PLATE_TOP;
const TOUCH_TRAVEL = DROP_GAP;
const FULL_TRAVEL = DROP_GAP + (FILE_H - CRUSH_H);
const RAM_TOP = 32;
const RAM_IDLE = PLATE_TOP - RAM_TOP;

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
          ? "h-full w-full object-fill"
          : "w-full rounded-xl border border-zinc-200 bg-white object-contain"
      }
    />
  );
}

export function OtherFileCompressor() {
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

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(pressTimerRef.current);
      window.clearTimeout(payTimerRef.current);
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

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(pressTimerRef.current);
    setPhase("idle");
    setDone(false);
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }

  function closeModal() {
    setModalActive(false);
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(pressTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setPhase("idle");
    }, MODAL_MS);
  }

  function openPay() {
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
  const plateTravel =
    phase === "crush" ? FULL_TRAVEL : phase === "drop" ? TOUCH_TRAVEL : 0;
  const motionMs = crushing ? CRUSH_MS : DROP_MS;
  const fileHeight = crushing ? CRUSH_H : FILE_H;

  return (
    <div className="w-full max-w-sm text-zinc-900" style={scrappyFont}>
      <p className="text-3xl text-red-700">File Compressor</p>

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
                aria-labelledby="compressor-title"
                className={[
                  "relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <div className="flex items-center justify-between">
                  <p id="compressor-title" className="text-2xl text-red-700">
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
                  className="relative mx-auto mt-4 w-[300px] max-w-full"
                  style={{ height: MACHINE_H }}
                >
                  <div className="absolute top-0 bottom-0 left-0 w-5 rounded-full bg-zinc-700" />
                  <div className="absolute top-0 right-0 bottom-0 w-5 rounded-full bg-zinc-700" />
                  <div className="absolute top-0 right-3 left-3 h-8 rounded-t-2xl bg-zinc-800" />
                  <div
                    className="absolute left-1/2 w-7 -translate-x-1/2 bg-zinc-500"
                    style={{
                      top: RAM_TOP,
                      height: RAM_IDLE + plateTravel,
                      transition: `height ${motionMs}ms ease-in`,
                    }}
                  />
                  <div
                    className="absolute right-8 left-8 rounded-sm bg-red-700 shadow-md"
                    style={{
                      top: PLATE_TOP,
                      height: PLATE_H,
                      transform: `translateY(${plateTravel}px)`,
                      transition: `transform ${motionMs}ms ease-in`,
                    }}
                  />
                  <div className="absolute right-3 bottom-0 left-3 h-7 rounded-b-2xl bg-zinc-800" />
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
                aria-labelledby="payment-required-title"
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
                <p id="payment-required-title" className="text-2xl text-red-700">
                  Payment required
                </p>
                <p className="mt-4 font-sans text-5xl text-zinc-900 tabular-nums">
                  $99
                </p>
                <p className="mt-1 text-lg">service fee</p>
                <button
                  type="button"
                  className="mt-6 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                  style={scrappyFont}
                >
                  Pay $99
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
