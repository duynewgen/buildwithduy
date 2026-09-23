"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "login" | "checked-in";

const USERNAME = "buildwithduy";
const PASSWORD = "hunter2";
const POLYNOMIAL = "x² + 12x + 20";
const MODAL_MS = 220;

const ACCEPTED = new Set(["(x+2)(x+10)", "(x+10)(x+2)"]);

function normalizeAnswer(raw: string) {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/·/g, "")
    .replace(/\*/g, "")
    .replace(/×/g, "");
}

function isCorrectFactorization(raw: string) {
  return ACCEPTED.has(normalizeAnswer(raw));
}

export function PasswordTwoFactor() {
  const [phase, setPhase] = useState<Phase>("login");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);
  const finishTimerRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted]);

  useEffect(() => {
    if (modalActive) {
      inputRef.current?.focus();
    }
  }, [modalActive]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
    setAnswer("");
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
      setAnswer("");
      setError(false);
      after?.();
    }, MODAL_MS);
  }

  function submitFactor(event: FormEvent) {
    event.preventDefault();
    if (!isCorrectFactorization(answer)) {
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
              <span className="text-sm text-zinc-500">username</span>
              <input
                type="text"
                value={USERNAME}
                readOnly
                tabIndex={-1}
                className="mt-1.5 w-full cursor-default rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-sans text-sm text-zinc-900 outline-none"
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm text-zinc-500">password</span>
              <input
                type="password"
                value={PASSWORD}
                readOnly
                tabIndex={-1}
                className="mt-1.5 w-full cursor-default rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-sans text-sm text-zinc-900 outline-none"
              />
            </label>

            <button
              type="button"
              onClick={openModal}
              className="mt-5 w-full cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
            >
              continue with two-factor authentication
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
                aria-labelledby="two-factor-title"
                className={[
                  "relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <form onSubmit={submitFactor} className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        id="two-factor-title"
                        className="text-sm tracking-wide text-zinc-900"
                      >
                        two-factor authentication
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

                  <p className="mt-6 text-center font-sans text-xl tabular-nums tracking-tight text-zinc-900 sm:text-2xl">
                    {POLYNOMIAL}
                  </p>

                  <label className="mt-5 block">
                    <span className="text-sm text-zinc-500">
                      your factorization
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={answer}
                      onChange={(event) => {
                        setAnswer(event.target.value);
                        if (error) setError(false);
                      }}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="(x+?)(x+?)"
                      className={[
                        "mt-1.5 w-full rounded-xl border bg-zinc-50 px-3 py-2.5 font-sans text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400",
                        error
                          ? "border-rose-300 focus:border-rose-400"
                          : "border-zinc-200 focus:border-zinc-400",
                      ].join(" ")}
                      aria-invalid={error}
                    />
                  </label>

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
