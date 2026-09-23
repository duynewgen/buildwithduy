"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "login" | "checked-in";

const PHONE = "0123456789";
const MODAL_MS = 220;
const OTP_LENGTH = 6;

function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function AuthOtp() {
  const [phase, setPhase] = useState<Phase>("login");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [code, setCode] = useState("");
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);
  const finishTimerRef = useRef(0);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalMounted) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted]);

  useEffect(() => {
    if (modalActive) {
      digitRefs.current[0]?.focus();
    }
  }, [modalActive]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
    setCode(randomOtp());
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setError(false);
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
      setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setError(false);
      after?.();
    }, MODAL_MS);
  }

  function setDigitAt(index: number, value: string) {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (error) setError(false);
    return next;
  }

  function onDigitChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      setDigitAt(index, "");
      return;
    }

    const chars = cleaned.slice(0, OTP_LENGTH - index).split("");
    const next = [...digits];
    chars.forEach((char, offset) => {
      next[index + offset] = char;
    });
    setDigits(next);
    if (error) setError(false);

    const focusIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    digitRefs.current[focusIndex]?.focus();
  }

  function onDigitKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
      setDigitAt(index - 1, "");
    }
    if (event.key === "ArrowLeft" && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    setDigits(next);
    if (error) setError(false);
    digitRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function submitOtp(event: FormEvent) {
    event.preventDefault();
    const entered = digits.join("");
    if (entered !== code) {
      setError(true);
      return;
    }
    setError(false);
    setPhase("checked-in");
    window.clearTimeout(finishTimerRef.current);
    finishTimerRef.current = window.setTimeout(() => {
      closeModal();
    }, 450);
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
                onClick={() => closeModal()}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="otp-title"
                className={[
                  "relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <form onSubmit={submitOtp} className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        id="otp-title"
                        className="text-sm tracking-wide text-zinc-900"
                      >
                        enter otp
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => closeModal()}
                      className="cursor-pointer rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                      aria-label="close"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-zinc-600">
                    please check your sms or phone for opt
                  </p>
                  <p className="mt-2 font-sans text-sm tabular-nums text-zinc-500">
                    hint: your otp is {code}
                  </p>

                  <div className="mt-5 flex justify-between gap-2">
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          digitRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit}
                        onChange={(event) =>
                          onDigitChange(index, event.target.value)
                        }
                        onKeyDown={(event) => onDigitKeyDown(index, event)}
                        onPaste={onPaste}
                        aria-label={`digit ${index + 1}`}
                        className={[
                          "h-12 w-10 rounded-xl border bg-zinc-50 text-center font-sans text-lg tabular-nums text-zinc-900 outline-none transition sm:h-14 sm:w-11",
                          error
                            ? "border-rose-300 focus:border-rose-400"
                            : "border-zinc-200 focus:border-zinc-400",
                        ].join(" ")}
                      />
                    ))}
                  </div>

                  {error ? (
                    <p className="mt-2 text-sm text-rose-600">
                      not quite. try again.
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className="mt-5 w-full cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                  >
                    verify
                  </button>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
