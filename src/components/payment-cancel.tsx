"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "manage" | "paid";

const MODAL_MS = 220;

const CURRENT_PLAN = {
  name: "pro max",
  amount: 29.99,
  period: "/mo",
} as const;

const EXIT_OPTIONS = [
  {
    id: "soft",
    name: "soft exit",
    amount: 4.99,
    blurb: "cancel at the end of this billing cycle.",
    highlight: false,
  },
  {
    id: "standard",
    name: "standard",
    amount: 19.99,
    blurb: "cancel now. keep access for 7 days.",
    highlight: false,
  },
  {
    id: "instant",
    name: "instant",
    amount: 49.99,
    blurb: "leave immediately. we will miss you.",
    highlight: true,
  },
] as const;

type ExitOption = (typeof EXIT_OPTIONS)[number];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function PaymentCancel() {
  const [phase, setPhase] = useState<Phase>("manage");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);
  const [selectedExit, setSelectedExit] = useState<ExitOption | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);

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

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
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
      after?.();
    }, MODAL_MS);
  }

  function chooseExit(option: ExitOption) {
    closeModal(() => setSelectedExit(option));
  }

  function payCancelFee() {
    if (!selectedExit) return;
    setPaidTotal(selectedExit.amount);
    setPhase("paid");
  }

  if (phase === "paid") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900">
            {money(paidTotal)}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            you&apos;re cancelled. thank you for your payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-sm text-left">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm tracking-wide text-zinc-500">your plan</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 text-xs text-white">
              sub
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-900">
                {CURRENT_PLAN.name} plan
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">billed monthly</p>
            </div>
            <p className="shrink-0 font-sans text-sm tabular-nums text-zinc-900">
              {money(CURRENT_PLAN.amount)}
              <span className="text-xs text-zinc-500">{CURRENT_PLAN.period}</span>
            </p>
          </div>

          {selectedExit ? (
            <div className="mt-3 flex animate-[fade-up_0.28s_ease-out] items-center gap-3">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800">
                fee
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-900">
                  {selectedExit.name} cancellation
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">one-time farewell</p>
              </div>
              <p className="shrink-0 font-sans text-sm tabular-nums text-zinc-900">
                {money(selectedExit.amount)}
              </p>
            </div>
          ) : null}

          <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">
                {CURRENT_PLAN.name} subscription
              </span>
              <span className="font-sans tabular-nums text-zinc-900">
                {money(CURRENT_PLAN.amount)}
                <span className="text-xs text-zinc-500">
                  {CURRENT_PLAN.period}
                </span>
              </span>
            </div>
            {selectedExit ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">cancellation fee</span>
                  <span className="font-sans tabular-nums text-zinc-900">
                    {money(selectedExit.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">next bill</span>
                  <span className="font-sans tabular-nums text-zinc-900">
                    $0.00
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
                  <span className="text-zinc-900">today you pay</span>
                  <span className="font-sans text-base tabular-nums text-zinc-900">
                    {money(selectedExit.amount)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">status</span>
                <span className="text-zinc-900">active</span>
              </div>
            )}
          </div>

          {selectedExit ? (
            <button
              type="button"
              onClick={payCancelFee}
              className="mt-5 w-full cursor-pointer transition hover:opacity-90 active:opacity-80"
              aria-label="buy with apple pay"
            >
              <Image
                src="/payment/buy-with-apple-pay.png"
                alt=""
                width={343}
                height={50}
                className="h-12 w-full object-contain"
                draggable={false}
                priority
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={openModal}
              className="mt-5 w-full cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
            >
              cancel subscription
            </button>
          )}
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
                aria-labelledby="cancel-exit-title"
                className={[
                  "relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
                  <div>
                    <p
                      id="cancel-exit-title"
                      className="text-sm tracking-wide text-zinc-900"
                    >
                      choose an exit
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      cancel selected. settling your farewell fee…
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

                <div className="space-y-2 p-4">
                  {EXIT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => chooseExit(option)}
                      className={[
                        "flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition",
                        option.highlight
                          ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                          : "border-zinc-200 bg-white hover:border-zinc-900",
                      ].join(" ")}
                    >
                      <div>
                        <p
                          className={[
                            "text-sm",
                            option.highlight ? "text-white" : "text-zinc-900",
                          ].join(" ")}
                        >
                          {option.name}
                        </p>
                        <p
                          className={[
                            "mt-0.5 text-xs",
                            option.highlight
                              ? "text-zinc-300"
                              : "text-zinc-500",
                          ].join(" ")}
                        >
                          {option.blurb}
                        </p>
                      </div>
                      <p
                        className={[
                          "shrink-0 font-sans text-sm tabular-nums",
                          option.highlight ? "text-white" : "text-zinc-900",
                        ].join(" ")}
                      >
                        {money(option.amount)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
