"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "manage" | "cancelled";

const MODAL_MS = 220;
const ESSAY_WORDS = 500;

const CURRENT_PLAN = {
  name: "pro max",
  amount: 29.99,
  period: "/mo",
} as const;

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function wordCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function PaymentCancelThree() {
  const [phase, setPhase] = useState<Phase>("manage");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [essay, setEssay] = useState("");
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);
  const essayRef = useRef<HTMLTextAreaElement>(null);

  const words = useMemo(() => wordCount(essay), [essay]);
  const ready = words >= ESSAY_WORDS;

  useEffect(() => {
    setMounted(true);
    return () => window.clearTimeout(closeTimerRef.current);
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
    if (modalActive) essayRef.current?.focus();
  }, [modalActive]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    setEssay("");
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
      setEssay("");
      after?.();
    }, MODAL_MS);
  }

  function submitEssay() {
    if (!ready) return;
    setPhase("cancelled");
    closeModal();
  }

  if (phase === "cancelled") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">you&apos;re cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-lg text-left">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
          <p className="text-base tracking-wide text-zinc-500">your plan</p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 text-sm text-white">
              sub
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg text-zinc-900">
                {CURRENT_PLAN.name} plan
              </p>
              <p className="mt-1 text-base text-zinc-500">billed monthly</p>
            </div>
            <p className="shrink-0 font-sans text-lg tabular-nums text-zinc-900">
              {money(CURRENT_PLAN.amount)}
              <span className="text-sm text-zinc-500">{CURRENT_PLAN.period}</span>
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5 text-base">
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">
                {CURRENT_PLAN.name} subscription
              </span>
              <span className="font-sans tabular-nums text-zinc-900">
                {money(CURRENT_PLAN.amount)}
                <span className="text-sm text-zinc-500">
                  {CURRENT_PLAN.period}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">status</span>
              <span className="text-zinc-900">active</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="mt-6 w-full cursor-pointer rounded-full bg-rose-600 px-4 py-4 text-lg text-white transition hover:bg-rose-700"
          >
            cancel subscription
          </button>
        </div>
      </div>

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
                aria-labelledby="cancel-essay-title"
                className={[
                  "relative z-10 flex max-h-[min(92vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
                  <div>
                    <p
                      id="cancel-essay-title"
                      className="text-xl tracking-wide text-zinc-900"
                    >
                      before you go
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-zinc-600">
                      in your own words, please write a 500-word essay
                      explaining why you are trying to cancel this
                      subscription
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

                <form
                  className="flex min-h-0 flex-1 flex-col gap-3 p-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitEssay();
                  }}
                >
                  <textarea
                    ref={essayRef}
                    value={essay}
                    onChange={(event) => setEssay(event.target.value)}
                    rows={10}
                    spellCheck
                    placeholder="dear subscription team..."
                    className="min-h-48 w-full flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-3 py-3 font-sans text-base leading-relaxed text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={[
                        "font-sans text-base tabular-nums",
                        ready ? "text-zinc-900" : "text-zinc-500",
                      ].join(" ")}
                    >
                      {words} / {ESSAY_WORDS} words
                    </p>
                    <button
                      type="submit"
                      disabled={!ready}
                      className="cursor-pointer rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-base text-white transition hover:bg-zinc-800 disabled:cursor-default disabled:opacity-40"
                    >
                      submit essay
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
