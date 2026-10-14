"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FILE_NAME = "mcdonalds-application.zip";
const VIDEO_SRC = "/other/unzip-pants.mp4?v=2";
const MODAL_MS = 220;
const STAGGER_MS = 180;
const STREAM_MS = 900;

const FILES = [
  {
    name: "mcdonalds_job-application.pdf",
    src: "/other/mcdonalds-job-application.png",
  },
  {
    name: "mcdonalds-offer.pdf",
    src: "/other/mcdonalds-offer.png",
  },
];

type Flight = { x: number; y: number };

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

function ZipFolder() {
  return (
    <div>
      <img src="/other/blue-folder.png" alt="" className="h-44 w-52 object-contain object-left" />
      <p className="mt-2 text-base">{FILE_NAME}</p>
    </div>
  );
}

function FlyingFile({
  name,
  src,
  index,
  flight,
}: {
  name: string;
  src: string;
  index: number;
  flight: Flight | null;
}) {
  return (
    <div
      data-extract-file=""
      className={
        flight
          ? "animate-unzip-stream relative z-10 w-40 shrink-0"
          : "relative z-10 w-40 shrink-0 opacity-0"
      }
      style={
        flight
          ? ({
              animationDelay: `${index * STAGGER_MS}ms`,
              "--stream-from-x": `${flight.x}px`,
              "--stream-from-y": `${flight.y}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <img
        src={src}
        alt={name}
        className="h-48 w-full rounded-md border border-zinc-300 bg-white object-cover object-top shadow"
      />
      <p className="mt-1 text-center text-xs leading-tight">{name}</p>
    </div>
  );
}

export function OtherFileUnzip() {
  const [mounted, setMounted] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [payMounted, setPayMounted] = useState(false);
  const [payActive, setPayActive] = useState(false);
  const closeTimerRef = useRef(0);
  const streamTimerRef = useRef(0);
  const payTimerRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRowRef = useRef<HTMLDivElement>(null);
  const payOpenedRef = useRef(false);
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [filesMounted, setFilesMounted] = useState(false);
  const [filesActive, setFilesActive] = useState(false);
  const [rowLeft, setRowLeft] = useState<number | null>(null);
  const [rowTop, setRowTop] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(streamTimerRef.current);
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

  useLayoutEffect(() => {
    if (!modalActive) return;
    const clip = videoRef.current?.getBoundingClientRect();
    if (!clip?.width) return;
    const rowWidth = 160 * FILES.length + 20;
    const preferred = clip.right + 28;
    setRowLeft(Math.min(preferred, window.innerWidth - 16 - rowWidth));
    setRowTop(clip.top + clip.height / 2);
  }, [modalActive]);

  useEffect(() => {
    if (rowLeft == null) return;
    streamTimerRef.current = window.setTimeout(() => setStreaming(true), 280);
    return () => window.clearTimeout(streamTimerRef.current);
  }, [rowLeft]);

  useLayoutEffect(() => {
    if (!streaming) return;
    const video = videoRef.current;
    const row = fileRowRef.current;
    if (!video || !row) return;
    const clip = video.getBoundingClientRect();
    const zipperX = clip.left + clip.width * 0.5;
    const zipperY = clip.top + clip.height * 0.58;
    const cards = [...row.querySelectorAll<HTMLElement>("[data-extract-file]")];
    setFlights(
      cards.map((card) => {
        const box = card.getBoundingClientRect();
        return {
          x: zipperX - (box.left + box.width / 2),
          y: zipperY - (box.top + box.height / 2),
        };
      }),
    );
  }, [streaming]);

  useEffect(() => {
    if (!streaming) return;
    const timer = window.setTimeout(() => {
      videoRef.current?.pause();
      setFilesMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFilesActive(true));
      });
    }, STAGGER_MS * (FILES.length - 1) + STREAM_MS);
    return () => window.clearTimeout(timer);
  }, [streaming]);

  function download() {
    videoRef.current?.pause();
    openPay();
  }

  function openPay() {
    if (payOpenedRef.current) return;
    payOpenedRef.current = true;
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

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(streamTimerRef.current);
    window.clearTimeout(payTimerRef.current);
    payOpenedRef.current = false;
    setFlights(null);
    setFilesMounted(false);
    setFilesActive(false);
    setRowLeft(null);
    setRowTop(null);
    setStreaming(false);
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }

  function closeModal() {
    setModalActive(false);
    videoRef.current?.pause();
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(streamTimerRef.current);
    window.clearTimeout(payTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setStreaming(false);
      setFlights(null);
      setFilesMounted(false);
      setFilesActive(false);
      setRowLeft(null);
      setRowTop(null);
    }, MODAL_MS);
  }

  return (
    <div className="w-full max-w-sm text-zinc-900" style={scrappyFont}>
      <p className="text-3xl text-red-700">File Unzipping</p>
      <div className="mt-5">
        <ZipFolder />
      </div>
      <button
        type="button"
        onClick={openModal}
        className="mt-4 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Unzip
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
                className={[
                  "relative z-10 flex flex-col items-center transition duration-200 ease-out",
                  modalActive ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    className="aspect-video w-[min(860px,92vw)] rounded-2xl object-cover shadow-xl"
                    playsInline
                    autoPlay
                    muted
                    loop
                  />
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute top-3 right-3 cursor-pointer rounded-full bg-white/80 p-1 text-zinc-500 hover:bg-white hover:text-zinc-900"
                    aria-label="close"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
              {streaming && !filesMounted ? (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div
                    ref={fileRowRef}
                    className="absolute flex -translate-y-1/2 items-center gap-5"
                    style={{ left: rowLeft ?? 0, top: rowTop ?? "50%" }}
                  >
                    {FILES.map((file, index) => (
                      <FlyingFile
                        key={file.name}
                        index={index}
                        flight={flights?.[index] ?? null}
                        {...file}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}

      {mounted && filesMounted
        ? createPortal(
            <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  filesActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={closeModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="download"
                className={[
                  "relative z-10 w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl transition duration-200 ease-out",
                  filesActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="close"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
                <div className="mt-2 flex items-start justify-center gap-5">
                  {FILES.map((file) => (
                    <div key={file.name} className="w-40">
                      <img
                        src={file.src}
                        alt={file.name}
                        className="h-48 w-full rounded-md border border-zinc-300 bg-white object-cover object-top shadow"
                      />
                      <p className="mt-1 text-center text-xs leading-tight">{file.name}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={download}
                  className="mt-5 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                  style={scrappyFont}
                >
                  Download
                </button>
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
                  $199
                </p>
                <p className="mt-1 text-lg">service fee</p>
                <button
                  type="button"
                  className="mt-6 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                  style={scrappyFont}
                >
                  Pay $199
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
