"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MODAL_MS = 220;
const FLASH_MS = 180;

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

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
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"detect" | "photo">("detect");
  const [cameraOn, setCameraOn] = useState(true);
  const [flash, setFlash] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(flashTimerRef.current);
      scheduleCameraRelease();
    };
  }, []);

  useEffect(() => {
    if (step !== "photo" || !cameraOn) return;
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
  }, [step, cameraOn]);

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
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }

  function closeModal() {
    setModalActive(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
    }, MODAL_MS);
  }

  function takePhoto() {
    if (flash || modalMounted) return;
    setFlash(true);
    window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setFlash(false);
      openModal();
    }, FLASH_MS);
  }

  return (
    <div
      className="mx-auto w-full max-w-sm text-center text-zinc-900"
      style={scrappyFont}
    >
      <p className="text-3xl text-red-700">what asian are you</p>

      {step === "detect" ? (
        <button
          type="button"
          onClick={() => setStep("photo")}
          className="mt-5 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
          style={scrappyFont}
        >
          detect your type
        </button>
      ) : (
        <div className="mx-auto mt-5 w-80 max-w-full">
          <div className="rounded-[2rem] border-4 border-zinc-800 bg-zinc-900 px-3 pt-3 pb-4 shadow-md">
            <div className="mx-auto mb-2 h-4 w-4 rounded-full border-2 border-zinc-500 bg-black" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover [transform:scaleX(-1)]"
                />
              ) : null}
              <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-white/80" />
              <span className="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-white/80" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-white/80" />
              <span className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r-2 border-b-2 border-white/80" />
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
            take photo
          </button>
          <button
            type="button"
            aria-pressed={cameraOn}
            onClick={() => setCameraOn((on) => !on)}
            className="mx-auto mt-3 block cursor-pointer rounded-full border-2 border-red-900 bg-white px-4 py-1.5 text-lg text-red-700"
            style={scrappyFont}
          >
            {cameraOn ? "camera off" : "camera on"}
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
                <p id="asian-title" className="text-2xl text-red-700">
                  eyes not detected.
                  <br />
                  please try again
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
