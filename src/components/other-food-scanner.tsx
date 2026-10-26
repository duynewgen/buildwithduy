"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MEAL_SRC = "/other/food-scan.png";
const MODAL_MS = 220;
const ANALYZE_MS = 1000;

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const COMPOUNDS = [
  { formula: "NaCl", name: "sodium chloride", amount: 18.4 },
  { formula: "C₁₂H₂₂O₁₁", name: "sucrose", amount: 22.7 },
  { formula: "C₈H₁₀N₄O₂", name: "caffeine", amount: 3.1 },
  { formula: "C₆H₈O₇", name: "citric acid", amount: 4.6 },
  { formula: "H₂O", name: "water", amount: 11.0 },
  { formula: "C₅₅H₉₈O₆", name: "triglyceride", amount: 31.2 },
  { formula: "C₆H₁₂O₆", name: "glucose", amount: 14.8 },
  { formula: "C₅H₈NO₄Na", name: "monosodium glutamate", amount: 8.9 },
  { formula: "C₃H₈O₃", name: "propylene glycol", amount: 6.4 },
  { formula: "H₃PO₄", name: "phosphoric acid", amount: 7.8 },
  { formula: "C₁₄H₂₂O", name: "butylated hydroxyanisole", amount: 4.2 },
  { formula: "C₁₅H₂₄O", name: "butylated hydroxytoluene", amount: 3.7 },
  { formula: "C₁₀H₁₄O₂", name: "tert-butylhydroquinone", amount: 5.1 },
  { formula: "C₂H₄N₄O₂", name: "azodicarbonamide", amount: 2.8 },
  { formula: "NaNO₂", name: "sodium nitrite", amount: 6.6 },
  { formula: "NaAl₃H₁₄(PO₄)₈", name: "sodium aluminum phosphate", amount: 4.4 },
  { formula: "SiO₂", name: "silicon dioxide", amount: 3.3 },
  { formula: "TiO₂", name: "titanium dioxide", amount: 2.9 },
  { formula: "KBrO₃", name: "potassium bromate", amount: 1.7 },
  { formula: "C₁₉H₂₀Br₆O₃", name: "brominated vegetable oil", amount: 4.8 },
  { formula: "C₃H₄O", name: "acrolein", amount: 2.2 },
  { formula: "C₃H₅NO", name: "acrylamide", amount: 5.5 },
  { formula: "CH₂O", name: "formaldehyde", amount: 3.6 },
  { formula: "C₂H₄O", name: "acetaldehyde", amount: 2.4 },
  { formula: "C₆H₆", name: "benzene", amount: 1.9 },
  { formula: "C₈H₈", name: "styrene", amount: 1.4 },
  { formula: "C₂H₃Cl", name: "vinyl chloride", amount: 0.8 },
  { formula: "C₂H₄O", name: "ethylene oxide", amount: 1.1 },
  { formula: "C₂₀H₁₂", name: "benzo[a]pyrene", amount: 2.6 },
  { formula: "C₂H₆N₂O", name: "n-nitrosodimethylamine", amount: 1.8 },
  { formula: "C₁₃H₁₂N₄", name: "phip", amount: 3.2 },
  { formula: "C₁₁H₁₁N₅", name: "meiqx", amount: 2.1 },
  { formula: "C₄H₆N₂", name: "4-methylimidazole", amount: 4.9 },
  { formula: "C₄H₆O₂", name: "diacetyl", amount: 3.5 },
  { formula: "C₄H₄O", name: "furan", amount: 2.7 },
  { formula: "C₆H₆O₃", name: "hydroxymethylfurfural", amount: 5.3 },
  { formula: "C₃H₄O₂", name: "malondialdehyde", amount: 4.1 },
  { formula: "C₃H₅ClO₂", name: "3-mcpd", amount: 2.3 },
  { formula: "C₁₈H₃₄O₂", name: "elaidic acid", amount: 9.6 },
  { formula: "C₈HF₁₅O₂", name: "perfluorooctanoic acid", amount: 1.2 },
  { formula: "C₈HF₁₇O₃S", name: "perfluorooctane sulfonate", amount: 0.9 },
  { formula: "C₁₆H₂₂O₄", name: "bisphenol a", amount: 1.6 },
  { formula: "C₂₄H₃₈O₄", name: "diethylhexyl phthalate", amount: 2.5 },
  { formula: "C₁₂H₄Cl₄O₂", name: "dioxin", amount: 0.7 },
  { formula: "C₁₂H₁₀Cl₄", name: "polychlorinated biphenyl", amount: 1.3 },
  { formula: "Pb", name: "lead", amount: 0.4 },
  { formula: "Cd", name: "cadmium", amount: 0.3 },
  { formula: "As", name: "arsenic", amount: 0.6 },
  { formula: "Hg", name: "mercury", amount: 0.2 },
  { formula: "C₃H₈O₃", name: "glycerol", amount: 6.1 },
  { formula: "C₁₀H₁₄N₂Na₂O₈", name: "calcium disodium edta", amount: 3.8 },
  { formula: "Na₂S₂O₅", name: "sodium metabisulfite", amount: 2.0 },
  { formula: "SO₂", name: "sulfur dioxide", amount: 1.5 },
  { formula: "Na₅P₃O₁₀", name: "sodium tripolyphosphate", amount: 4.7 },
  { formula: "(C₆H₉NaO₇)n", name: "sodium alginate", amount: 3.0 },
  { formula: "C₆₄H₁₂₄O₂₆", name: "polysorbate 80", amount: 5.8 },
  { formula: "C₁₆H₉N₄Na₃O₉S₂", name: "tartrazine", amount: 2.2 },
  { formula: "C₁₆H₁₀N₂Na₂O₇S₂", name: "sunset yellow", amount: 1.9 },
  { formula: "C₁₈H₁₄N₂Na₂O₈S₂", name: "allura red", amount: 2.4 },
  { formula: "C₃₇H₃₄N₂Na₂O₉S₃", name: "brilliant blue", amount: 1.1 },
  { formula: "C₁₂H₁₉Cl₃O₈", name: "sucralose", amount: 7.2 },
  { formula: "C₄H₄KO₄NS", name: "acesulfame potassium", amount: 4.3 },
  { formula: "C₁₄H₁₈N₂O₅", name: "aspartame", amount: 5.6 },
  { formula: "C₇H₅NO₃S", name: "saccharin", amount: 3.4 },
  { formula: "(C₁₂H₁₈O₉)n", name: "carrageenan", amount: 6.8 },
  { formula: "[Si(CH₃)₂O]n", name: "dimethylpolysiloxane", amount: 4.0 },
  { formula: "Al₂(SO₄)₃", name: "aluminum sulfate", amount: 1.6 },
  { formula: "CaSO₄", name: "calcium sulfate", amount: 2.9 },
  { formula: "Mg₃Si₄O₁₀(OH)₂", name: "talc", amount: 1.8 },
];

const TOTAL = COMPOUNDS.reduce((sum, compound) => sum + compound.amount, 0);

export function OtherFoodScanner() {
  const closeTimerRef = useRef(0);
  const analyzeTimerRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(analyzeTimerRef.current);
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
    }, MODAL_MS);
  }

  return (
    <div className="w-full max-w-sm text-zinc-900" style={scrappyFont}>
      <p className="text-3xl text-red-700">Food Scanner</p>

      <div className="mx-auto mt-5 w-80">
        <img
          src={MEAL_SRC}
          alt="meal"
          className="w-full rounded-xl border border-zinc-200 bg-white object-contain"
        />
      </div>

      <button
        type="button"
        onClick={openModal}
        className="mt-4 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Analyze
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
                role="dialog"
                aria-modal="true"
                aria-labelledby="food-scanner-title"
                className={[
                  "relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-200 bg-white px-6 py-6 text-center shadow-xl transition duration-200 ease-out",
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
                  <div id="food-scanner-title" className="text-left">
                    <p className="text-center text-2xl text-red-700">Analysis</p>
                    <ul className="mt-5 max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                      {COMPOUNDS.map((compound) => (
                        <li
                          key={compound.name}
                          className="flex items-baseline justify-between gap-4"
                        >
                          <span className="text-xl">{compound.formula}</span>
                          <span className="font-sans text-xl text-zinc-900 tabular-nums">
                            {compound.amount.toFixed(1)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-baseline justify-between border-t border-zinc-200 pt-3">
                      <span className="text-xl">total</span>
                      <span className="font-sans text-xl text-red-700 tabular-nums">
                        {TOTAL.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div id="food-scanner-title">
                    <div className="relative mx-auto w-56 overflow-hidden rounded-xl border border-zinc-200">
                      <img src={MEAL_SRC} alt="" className="w-full object-contain" />
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-food-scan bg-red-600 shadow-[0_0_12px_#dc2626]" />
                    </div>
                    <span className="mx-auto mt-5 block h-9 w-9 animate-spin rounded-full border-2 border-red-200 border-t-red-700" />
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
