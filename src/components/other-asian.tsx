"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MODAL_MS = 220;
const FLASH_MS = 180;
const ANALYZE_MS = 1400;

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const FACES = [
  "/other/asian/1.png",
  "/other/asian/2.jpg",
  "/other/asian/3.png",
  "/other/asian/4.png",
  "/other/asian/5.png",
  "/other/asian/6.png",
  "/other/asian/7.png",
  "/other/asian/8.png",
];

function FaceRun() {
  const row = (copy: string) => (
    <div className="flex shrink-0 gap-3 pr-3">
      {FACES.map((src) => (
        <img
          key={`${copy}-${src}`}
          src={src}
          alt=""
          className="h-36 w-28 rounded-xl object-cover"
        />
      ))}
    </div>
  );

  return (
    <div className="mt-8 overflow-hidden">
      <div className="flex w-max animate-asian-run">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

let cameraPromise: Promise<MediaStream> | null = null;
let releaseTimer = 0;

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

async function requestCamera() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      throw error;
    }
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }
}

function openCamera() {
  window.clearTimeout(releaseTimer);
  if (!cameraPromise) {
    cameraPromise = requestCamera().catch((error) => {
      cameraPromise = null;
      throw error;
    });
  }
  return cameraPromise;
}

function scheduleCameraRelease() {
  window.clearTimeout(releaseTimer);
  releaseTimer = window.setTimeout(() => {
    cameraPromise
      ?.then((stream) => stopStream(stream))
      .catch(() => {});
    cameraPromise = null;
  }, 300);
}

export function OtherAsian() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeTimerRef = useRef(0);
  const flashTimerRef = useRef(0);
  const analyzeTimerRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"detect" | "photo">("detect");
  const [flash, setFlash] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [still, setStill] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(flashTimerRef.current);
      window.clearTimeout(analyzeTimerRef.current);
      scheduleCameraRelease();
    };
  }, []);

  useEffect(() => {
    if (step !== "photo") return;
    let active = true;

    void openCamera()
      .then(async (stream) => {
        const video = videoRef.current;
        if (!active || !video) return;
        video.srcObject = stream;
        await video.play();
      })
      .catch(() => {});

    return () => {
      active = false;
      if (videoRef.current) videoRef.current.srcObject = null;
      scheduleCameraRelease();
    };
  }, [step]);

  useEffect(() => {
    if (!modalMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(analyzeTimerRef.current);
    setAnalyzed(false);
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
    analyzeTimerRef.current = window.setTimeout(() => {
      setAnalyzed(true);
    }, ANALYZE_MS);
  }

  function closeModal() {
    setModalActive(false);
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(analyzeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setAnalyzed(false);
      setStill(null);
    }, MODAL_MS);
  }

  function captureFrame() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.85);
  }

  function takePhoto() {
    if (flash || modalMounted) return;
    setStill(captureFrame());
    setFlash(true);
    window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setFlash(false);
      openModal();
    }, FLASH_MS);
  }

  return (
    <div
      className="mx-auto w-full max-w-2xl text-center text-zinc-900"
      style={scrappyFont}
    >
      <p className="text-4xl text-red-700">What Asian are you?</p>

      {step === "detect" ? (
        <>
          <button
            type="button"
            onClick={() => setStep("photo")}
            className="mt-5 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
            style={scrappyFont}
          >
            Start
          </button>
          <FaceRun />
        </>
      ) : (
        <div className="mx-auto mt-5 w-full">
          <div className="rounded-[2rem] border-4 border-zinc-800 bg-zinc-900 px-4 pt-4 pb-5 shadow-md">
            <div className="mx-auto mb-3 h-5 w-5 rounded-full border-2 border-zinc-500 bg-black" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={[
                  "h-full w-full object-cover [transform:scaleX(-1)]",
                  still ? "invisible" : "",
                ].join(" ")}
              />
              {still ? (
                <img
                  src={still}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              <span className="pointer-events-none absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-white/80" />
              <span className="pointer-events-none absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-white/80" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-white/80" />
              <span className="pointer-events-none absolute right-4 bottom-4 h-6 w-6 border-r-2 border-b-2 border-white/80" />
              <span className="pointer-events-none absolute inset-x-8 top-[42%] flex -translate-y-1/2 items-center gap-2">
                <span className="h-0.5 flex-1 bg-green-400 shadow-[0_0_10px_#4ade80]" />
                <span className="text-base leading-none text-green-400">Eyes line</span>
                <span className="h-0.5 flex-1 bg-green-400 shadow-[0_0_10px_#4ade80]" />
              </span>
              <span
                className={[
                  "pointer-events-none absolute inset-0 bg-white transition-opacity duration-100",
                  flash ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={takePhoto}
            className="mx-auto mt-4 block cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
            style={scrappyFont}
          >
            Analyze
          </button>
        </div>
      )}

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
                aria-labelledby="asian-title"
                className={[
                  "relative z-10 w-full max-w-md rounded-3xl border border-zinc-200 bg-white px-8 py-6 text-center shadow-xl transition duration-200 ease-out",
                  modalActive
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
                {analyzed ? (
                  <p id="asian-title" className="text-2xl text-red-700">
                    Your eyes cannot be detected.
                    <br />
                    Please try again.
                  </p>
                ) : (
                  <div id="asian-title">
                    <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-red-200 border-t-red-700" />
                    <p className="mt-4 text-2xl text-red-700">Analyzing...</p>
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
