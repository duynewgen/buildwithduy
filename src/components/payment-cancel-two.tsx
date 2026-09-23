"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Phase = "manage" | "done" | "stayed";
type Step =
  | "why"
  | "sure"
  | "name"
  | "phrase"
  | "captcha"
  | "hold"
  | "half"
  | "free"
  | "last"
  | "bye";

const MODAL_MS = 220;
const HOLD_MS = 2800;
const CONFIRM_NAME = "build with duy";
const CONFIRM_PHRASE = "cancel subscription";

const CURRENT_PLAN = {
  name: "pro max",
  amount: 29.99,
  period: "/mo",
} as const;

const REASONS = [
  "too expensive",
  "i never use it",
  "found something better",
  "just browsing cancel buttons",
] as const;

const CAPTCHA_TILES = [
  { id: "a", mark: "✓", correct: true },
  { id: "b", mark: "×", correct: false },
  { id: "c", mark: "✓", correct: true },
  { id: "d", mark: "○", correct: false },
  { id: "e", mark: "✓", correct: true },
  { id: "f", mark: "△", correct: false },
] as const;

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function PaymentCancelTwo() {
  const [phase, setPhase] = useState<Phase>("manage");
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [step, setStep] = useState<Step>("why");
  const [stepVisible, setStepVisible] = useState(true);
  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phraseValue, setPhraseValue] = useState("");
  const [phraseError, setPhraseError] = useState(false);
  const [captchaSelected, setCaptchaSelected] = useState<string[]>([]);
  const [captchaError, setCaptchaError] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [stayOffer, setStayOffer] = useState<"half" | "free" | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeTimerRef = useRef(0);
  const stepTimerRef = useRef(0);
  const holdRafRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(stepTimerRef.current);
      window.cancelAnimationFrame(holdRafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && step !== "bye") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted, step]);

  function resetFlow() {
    setStep("why");
    setStepVisible(true);
    setNameValue("");
    setNameError(false);
    setPhraseValue("");
    setPhraseError(false);
    setCaptchaSelected([]);
    setCaptchaError(false);
    setHolding(false);
    setHoldProgress(0);
    window.cancelAnimationFrame(holdRafRef.current);
  }

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    resetFlow();
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
      resetFlow();
      after?.();
    }, MODAL_MS);
  }

  function goTo(next: Step) {
    setStepVisible(false);
    window.clearTimeout(stepTimerRef.current);
    stepTimerRef.current = window.setTimeout(() => {
      setStep(next);
      setStepVisible(true);
    }, 160);
  }

  function finishCancel() {
    setPhase("done");
    closeModal();
  }

  function acceptStay(offer: "half" | "free") {
    setStayOffer(offer);
    setPhase("stayed");
    closeModal();
  }

  function submitName() {
    if (nameValue.trim().toLowerCase() !== CONFIRM_NAME) {
      setNameError(true);
      return;
    }
    setNameError(false);
    goTo("phrase");
  }

  function submitPhrase() {
    if (phraseValue.trim().toLowerCase() !== CONFIRM_PHRASE) {
      setPhraseError(true);
      return;
    }
    setPhraseError(false);
    goTo("captcha");
  }

  function toggleCaptcha(id: string) {
    setCaptchaError(false);
    setCaptchaSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function submitCaptcha() {
    const correctIds = CAPTCHA_TILES.filter((tile) => tile.correct).map(
      (tile) => tile.id,
    );
    const ok =
      correctIds.length === captchaSelected.length &&
      correctIds.every((id) => captchaSelected.includes(id));
    if (!ok) {
      setCaptchaError(true);
      setCaptchaSelected([]);
      return;
    }
    goTo("hold");
  }

  function startHold() {
    if (holding) return;
    setHolding(true);
    const started = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / HOLD_MS);
      setHoldProgress(progress);
      if (progress >= 1) {
        setHolding(false);
        goTo("half");
        return;
      }
      holdRafRef.current = requestAnimationFrame(tick);
    };

    holdRafRef.current = requestAnimationFrame(tick);
  }

  function stopHold() {
    window.cancelAnimationFrame(holdRafRef.current);
    setHolding(false);
    setHoldProgress(0);
  }

  if (phase === "done") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="font-display text-2xl tracking-tight text-zinc-900">
            we&apos;re sorry to see you go
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            your subscription is cancelled.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "stayed") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="font-display text-2xl tracking-tight text-zinc-900">
            still subscribed
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {stayOffer === "free"
              ? "next month is free. we knew you'd stay."
              : "next month is half off. welcome back to yourself."}
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
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">status</span>
              <span className="text-zinc-900">active</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="mt-5 w-full cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
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
                onClick={() => {
                  if (step !== "bye") closeModal();
                }}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-two-title"
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
                      id="cancel-two-title"
                      className="text-sm tracking-wide text-zinc-900"
                    >
                      cancel subscription
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      we&apos;d love for you to stay.
                    </p>
                  </div>
                  {step !== "bye" ? (
                    <button
                      type="button"
                      onClick={() => closeModal()}
                      className="cursor-pointer rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                      aria-label="close"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  ) : null}
                </div>

                <div
                  className={[
                    "p-4 transition duration-150 ease-out sm:p-5",
                    stepVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0",
                  ].join(" ")}
                >
                  {step === "why" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-zinc-900">
                        why are you leaving?
                      </p>
                      <p className="text-xs text-zinc-500">
                        pick anything. we already decided to make this hard.
                      </p>
                      <div className="space-y-2">
                        {REASONS.map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => goTo("sure")}
                            className="w-full cursor-pointer rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-800 transition hover:border-zinc-900"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {step === "sure" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">are you sure?</p>
                      <p className="text-xs text-zinc-500">
                        you&apos;ll lose shared playlists, unused credits, and
                        our respect.
                      </p>
                      <button
                        type="button"
                        onClick={() => closeModal()}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        never mind, keep plan
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("name")}
                        className="w-full cursor-pointer rounded-full border border-transparent px-4 py-2 text-xs tracking-wide text-zinc-400 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
                      >
                        yes, continue canceling
                      </button>
                    </div>
                  ) : null}

                  {step === "name" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">
                        type your name to confirm
                      </p>
                      <p className="text-xs text-zinc-500">
                        exactly as shown:{" "}
                        <span className="font-sans text-zinc-800">
                          {CONFIRM_NAME}
                        </span>
                      </p>
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(event) => {
                          setNameValue(event.target.value);
                          setNameError(false);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") submitName();
                        }}
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={CONFIRM_NAME}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 font-sans text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-900"
                      />
                      {nameError ? (
                        <p className="text-xs text-rose-600">
                          name doesn&apos;t match. try again.
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={submitName}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        confirm name
                      </button>
                    </div>
                  ) : null}

                  {step === "phrase" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">
                        type cancel subscription
                      </p>
                      <p className="text-xs text-zinc-500">
                        exactly as shown:{" "}
                        <span className="font-sans text-zinc-800">
                          {CONFIRM_PHRASE}
                        </span>
                      </p>
                      <input
                        type="text"
                        value={phraseValue}
                        onChange={(event) => {
                          setPhraseValue(event.target.value);
                          setPhraseError(false);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") submitPhrase();
                        }}
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={CONFIRM_PHRASE}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 font-sans text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-900"
                      />
                      {phraseError ? (
                        <p className="text-xs text-rose-600">
                          phrase doesn&apos;t match. try again.
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={submitPhrase}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        confirm phrase
                      </button>
                    </div>
                  ) : null}

                  {step === "captcha" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">
                        prove you&apos;re human
                      </p>
                      <p className="text-xs text-zinc-500">
                        select all squares with a checkmark. bots love
                        canceling.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {CAPTCHA_TILES.map((tile) => {
                          const selected = captchaSelected.includes(tile.id);
                          return (
                            <button
                              key={tile.id}
                              type="button"
                              onClick={() => toggleCaptcha(tile.id)}
                              className={[
                                "flex aspect-square cursor-pointer items-center justify-center rounded-xl border text-2xl transition",
                                selected
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400",
                              ].join(" ")}
                              aria-pressed={selected}
                              aria-label={`tile ${tile.mark}`}
                            >
                              {tile.mark}
                            </button>
                          );
                        })}
                      </div>
                      {captchaError ? (
                        <p className="text-xs text-rose-600">
                          not quite. try again, human.
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={submitCaptcha}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        verify
                      </button>
                    </div>
                  ) : null}

                  {step === "hold" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">hold to cancel</p>
                      <p className="text-xs text-zinc-500">
                        press and hold the button. letting go resets the bar.
                      </p>
                      <div className="h-4 w-full overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                        <div
                          className="h-full origin-left rounded-full bg-zinc-900"
                          style={{
                            width: `${Math.max(holdProgress * 100, holdProgress > 0 ? 2 : 0)}%`,
                          }}
                        />
                      </div>
                      <p className="font-sans text-center text-xs tabular-nums text-zinc-500">
                        {Math.round(holdProgress * 100)}%
                      </p>
                      <button
                        type="button"
                        onPointerDown={(event) => {
                          event.preventDefault();
                          startHold();
                        }}
                        onPointerUp={stopHold}
                        onPointerLeave={stopHold}
                        onPointerCancel={stopHold}
                        className="relative w-full cursor-pointer overflow-hidden rounded-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 select-none"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 bg-zinc-900/15"
                          style={{
                            width: `${holdProgress * 100}%`,
                          }}
                        />
                        <span className="relative">
                          {holding ? "keep holding…" : "hold here"}
                        </span>
                      </button>
                    </div>
                  ) : null}

                  {step === "half" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">
                        wait — one more month for half the price?
                      </p>
                      <p className="text-xs text-zinc-500">
                        next month for {money(CURRENT_PLAN.amount / 2)} instead
                        of {money(CURRENT_PLAN.amount)}.
                      </p>
                      <button
                        type="button"
                        onClick={() => acceptStay("half")}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        yes, half off
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("free")}
                        className="w-full cursor-pointer rounded-full border border-transparent px-4 py-2 text-xs tracking-wide text-zinc-400 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
                      >
                        no thanks
                      </button>
                    </div>
                  ) : null}

                  {step === "free" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">
                        alright — one more month for free?
                      </p>
                      <p className="text-xs text-zinc-500">
                        fine. next month is on us. please stay.
                      </p>
                      <button
                        type="button"
                        onClick={() => acceptStay("free")}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        yes, free month
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("last")}
                        className="w-full cursor-pointer rounded-full border border-transparent px-4 py-2 text-xs tracking-wide text-zinc-400 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
                      >
                        still cancel
                      </button>
                    </div>
                  ) : null}

                  {step === "last" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-900">last chance</p>
                      <p className="text-xs text-zinc-500">
                        really cancel? no take-backs. no confetti. no refund of
                        your time.
                      </p>
                      <button
                        type="button"
                        onClick={() => closeModal()}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        stay subscribed
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo("bye")}
                        className="w-full cursor-pointer rounded-full border border-transparent px-4 py-2 text-xs tracking-wide text-zinc-400 transition hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
                      >
                        cancel for real
                      </button>
                    </div>
                  ) : null}

                  {step === "bye" ? (
                    <div className="space-y-4 text-center">
                      <p className="text-sm text-zinc-900">
                        we&apos;re sorry to see you go
                      </p>
                      <p className="text-xs text-zinc-500">
                        processing your cancellation…
                      </p>
                      <button
                        type="button"
                        onClick={finishCancel}
                        className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-3 text-sm text-white transition hover:bg-zinc-800"
                      >
                        done
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
