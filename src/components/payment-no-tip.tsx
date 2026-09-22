"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Phase = "checkout" | "paid" | "subscribed";

const SUBTOTAL = 10;

const TIP_OPTIONS = [
  { label: "15%", pct: 0.15 },
  { label: "20%", pct: 0.2 },
  { label: "25%", pct: 0.25 },
] as const;

const PLANS = [
  {
    id: "basic",
    name: "basic",
    price: "$4.99",
    period: "/mo",
    blurb: "for people who tip sometimes.",
    highlight: false,
  },
  {
    id: "pro",
    name: "pro",
    price: "$12.99",
    period: "/mo",
    blurb: "for people who meant to tip.",
    highlight: false,
  },
  {
    id: "pro-max",
    name: "pro max",
    price: "$29.99",
    period: "/mo",
    blurb: "for people who clicked no tip.",
    highlight: true,
  },
] as const;

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function PaymentNoTip() {
  const [phase, setPhase] = useState<Phase>("checkout");
  const [modalOpen, setModalOpen] = useState(false);
  const [paidTotal, setPaidTotal] = useState(SUBTOTAL);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  function tipWith(pct: number) {
    const tip = Math.round(SUBTOTAL * pct * 100) / 100;
    setPaidTotal(SUBTOTAL + tip);
    setPhase("paid");
  }

  function choosePlan() {
    setModalOpen(false);
    setPhase("subscribed");
  }

  if (phase === "paid") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-3xl tabular-nums tracking-wide text-zinc-900">
            {money(paidTotal)}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            you&apos;re all set. thank you for your purchase.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "subscribed") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="font-display text-2xl tracking-tight text-zinc-900">
            welcome aboard
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            you declined the tip, so we enrolled you instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-sm text-left">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm tracking-wide text-zinc-500">your order</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <Image
                src="/payment/coffee.jpg"
                alt="coffee"
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-900">oat milk latte</p>
              <p className="mt-0.5 text-sm text-zinc-500">qty 1</p>
            </div>
            <p className="shrink-0 font-sans text-sm tabular-nums text-zinc-900">
              {money(SUBTOTAL)}
            </p>
          </div>

          <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">subtotal</span>
              <span className="font-sans tabular-nums text-zinc-900">
                {money(SUBTOTAL)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">tax</span>
              <span className="font-sans tabular-nums text-zinc-900">$0.00</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm text-zinc-900">add a tip?</p>
            <p className="mt-1 text-xs text-zinc-500">
              your barista will see this. probably.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {TIP_OPTIONS.map((option) => {
                const tip = Math.round(SUBTOTAL * option.pct * 100) / 100;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => tipWith(option.pct)}
                    className="flex cursor-pointer flex-col items-center rounded-xl border border-zinc-300 bg-white px-2 py-3 transition hover:border-zinc-900"
                  >
                    <span className="text-sm text-zinc-900">{option.label}</span>
                    <span className="mt-1 font-sans text-xs tabular-nums text-zinc-500">
                      {money(tip)}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 w-full cursor-pointer rounded-xl border border-transparent px-3 py-2 text-center text-xs tracking-wide text-zinc-400 transition hover:border-zinc-200 hover:bg-white hover:text-zinc-600"
            >
              no tip
            </button>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            aria-label="close"
            className="absolute inset-0 cursor-pointer bg-zinc-900/40"
            onClick={() => setModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="no-tip-plans-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <div>
                <p
                  id="no-tip-plans-title"
                  className="text-sm tracking-wide text-zinc-900"
                >
                  choose a plan
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  no tip selected. starting your subscription…
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
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
                    {plan.price}
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
        </div>
      ) : null}
    </>
  );
}
