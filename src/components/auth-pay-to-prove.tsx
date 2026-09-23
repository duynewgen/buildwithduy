"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "login" | "checked-in";

const USERNAME = "buildwithduy";
const PASSWORD = "hunter2";
const MODAL_MS = 220;

const PLANS = [
  {
    id: "basic",
    name: "basic",
    amount: 4.99,
    period: "/mo",
    blurb: "skip verification once per month.",
    highlight: false,
  },
  {
    id: "pro",
    name: "pro",
    amount: 12.99,
    period: "/mo",
    blurb: "skip verification up to three times a month.",
    highlight: false,
  },
  {
    id: "pro-max",
    name: "pro max",
    amount: 29.99,
    period: "/mo",
    blurb: "no verification needed from now on.",
    highlight: true,
  },
] as const;

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function AuthPayToProve() {
  const [phase, setPhase] = useState<Phase>("login");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);
  const finishTimerRef = useRef(0);

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

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
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

  function choosePlan() {
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
            <p className="mt-2 text-xs text-zinc-400">
              humanity verified. receipt pending.
            </p>
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
              verify your account
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
                aria-labelledby="pay-to-prove-title"
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
                      id="pay-to-prove-title"
                      className="text-sm tracking-wide text-zinc-900"
                    >
                      prove you&apos;re human
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      pick a plan to skip being verified the hard way.
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
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={choosePlan}
                      className={[
                        "flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition",
                        plan.highlight
                          ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                          : "border-zinc-200 bg-white hover:border-zinc-900",
                      ].join(" ")}
                    >
                      <div>
                        <p
                          className={[
                            "text-sm",
                            plan.highlight ? "text-white" : "text-zinc-900",
                          ].join(" ")}
                        >
                          {plan.name}
                        </p>
                        <p
                          className={[
                            "mt-0.5 text-xs",
                            plan.highlight ? "text-zinc-300" : "text-zinc-500",
                          ].join(" ")}
                        >
                          {plan.blurb}
                        </p>
                      </div>
                      <p
                        className={[
                          "shrink-0 font-sans text-sm tabular-nums",
                          plan.highlight ? "text-white" : "text-zinc-900",
                        ].join(" ")}
                      >
                        {money(plan.amount)}
                        <span
                          className={[
                            "text-xs",
                            plan.highlight ? "text-zinc-400" : "text-zinc-500",
                          ].join(" ")}
                        >
                          {plan.period}
                        </span>
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
