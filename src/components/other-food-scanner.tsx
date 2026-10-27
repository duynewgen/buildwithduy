"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MEAL_SRC = "/other/food-scan.png";
const MODAL_MS = 220;
const ANALYZE_MS = 1500;

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const COMPOUNDS = [
  { formula: "NaCl", name: "sodium chloride", amount: 253.8 },
  { formula: "C₁₂H₂₂O₁₁", name: "sucrose", amount: 283.2 },
  { formula: "C₈H₁₀N₄O₂", name: "caffeine", amount: 44 },
  { formula: "C₆H₈O₇", name: "citric acid", amount: 70.9 },
  { formula: "H₂O", name: "water", amount: 135 },
  { formula: "C₅₅H₉₈O₆", name: "triglyceride", amount: 927.9 },
  { formula: "C₆H₁₂O₆", name: "glucose", amount: 176.1 },
  { formula: "C₅H₈NO₄Na", name: "monosodium glutamate", amount: 123.9 },
  { formula: "C₃H₈O₃", name: "propylene glycol", amount: 86.1 },
  { formula: "H₃PO₄", name: "phosphoric acid", amount: 93.1 },
  { formula: "C₁₄H₂₂O", name: "butylated hydroxyanisole", amount: 60.1 },
  { formula: "C₁₅H₂₄O", name: "butylated hydroxytoluene", amount: 45.2 },
  { formula: "C₁₀H₁₄O₂", name: "tert-butylhydroquinone", amount: 74.5 },
  { formula: "C₂H₄N₄O₂", name: "azodicarbonamide", amount: 41.5 },
  { formula: "NaNO₂", name: "sodium nitrite", amount: 75.5 },
  { formula: "NaAl₃H₁₄(PO₄)₈", name: "sodium aluminum phosphate", amount: 59.3 },
  { formula: "SiO₂", name: "silicon dioxide", amount: 56 },
  { formula: "TiO₂", name: "titanium dioxide", amount: 32.5 },
  { formula: "KBrO₃", name: "potassium bromate", amount: 23.8 },
  { formula: "C₁₉H₂₀Br₆O₃", name: "brominated vegetable oil", amount: 69.1 },
  { formula: "C₃H₄O", name: "acrolein", amount: 25.1 },
  { formula: "C₃H₅NO", name: "acrylamide", amount: 83.3 },
  { formula: "CH₂O", name: "formaldehyde", amount: 47.1 },
  { formula: "C₂H₄O", name: "acetaldehyde", amount: 25.1 },
  { formula: "C₆H₆", name: "benzene", amount: 31 },
  { formula: "C₈H₈", name: "styrene", amount: 20.2 },
  { formula: "C₂H₃Cl", name: "vinyl chloride", amount: 8.9 },
  { formula: "C₂H₄O", name: "ethylene oxide", amount: 19 },
  { formula: "C₂₀H₁₂", name: "benzo[a]pyrene", amount: 41.5 },
  { formula: "C₂H₆N₂O", name: "n-nitrosodimethylamine", amount: 16.3 },
  { formula: "C₁₃H₁₂N₄", name: "phip", amount: 44.4 },
  { formula: "C₁₁H₁₁N₅", name: "meiqx", amount: 37.5 },
  { formula: "C₄H₆N₂", name: "4-methylimidazole", amount: 60.1 },
  { formula: "C₄H₆O₂", name: "diacetyl", amount: 52.7 },
  { formula: "C₄H₄O", name: "furan", amount: 36.3 },
  { formula: "C₆H₆O₃", name: "hydroxymethylfurfural", amount: 59.8 },
  { formula: "C₃H₄O₂", name: "malondialdehyde", amount: 58.1 },
  { formula: "C₃H₅ClO₂", name: "3-mcpd", amount: 32.4 },
  { formula: "C₁₈H₃₄O₂", name: "elaidic acid", amount: 138.6 },
  { formula: "C₈HF₁₅O₂", name: "perfluorooctanoic acid", amount: 14.7 },
  { formula: "C₈HF₁₇O₃S", name: "perfluorooctane sulfonate", amount: 14.7 },
  { formula: "C₁₆H₂₂O₄", name: "bisphenol a", amount: 27.5 },
  { formula: "C₂₄H₃₈O₄", name: "diethylhexyl phthalate", amount: 27.6 },
  { formula: "C₁₂H₄Cl₄O₂", name: "dioxin", amount: 10.2 },
  { formula: "C₁₂H₁₀Cl₄", name: "polychlorinated biphenyl", amount: 19.1 },
  { formula: "Pb", name: "lead", amount: 5.7 },
  { formula: "Cd", name: "cadmium", amount: 3.6 },
  { formula: "As", name: "arsenic", amount: 9.5 },
  { formula: "Hg", name: "mercury", amount: 3 },
  { formula: "C₃H₈O₃", name: "glycerol", amount: 87.6 },
  { formula: "C₁₀H₁₄N₂Na₂O₈", name: "calcium disodium edta", amount: 43.7 },
  { formula: "Na₂S₂O₅", name: "sodium metabisulfite", amount: 29.3 },
  { formula: "SO₂", name: "sulfur dioxide", amount: 20.4 },
  { formula: "Na₅P₃O₁₀", name: "sodium tripolyphosphate", amount: 68.8 },
  { formula: "(C₆H₉NaO₇)n", name: "sodium alginate", amount: 36.4 },
  { formula: "C₆₄H₁₂₄O₂₆", name: "polysorbate 80", amount: 85.9 },
  { formula: "C₁₆H₉N₄Na₃O₉S₂", name: "tartrazine", amount: 33 },
  { formula: "C₁₆H₁₀N₂Na₂O₇S₂", name: "sunset yellow", amount: 22.5 },
  { formula: "C₁₈H₁₄N₂Na₂O₈S₂", name: "allura red", amount: 37 },
  { formula: "C₃₇H₃₄N₂Na₂O₉S₃", name: "brilliant blue", amount: 16.6 },
  { formula: "C₁₂H₁₉Cl₃O₈", name: "sucralose", amount: 84.7 },
  { formula: "C₄H₄KO₄NS", name: "acesulfame potassium", amount: 61.2 },
  { formula: "C₁₄H₁₈N₂O₅", name: "aspartame", amount: 75.4 },
  { formula: "C₇H₅NO₃S", name: "saccharin", amount: 37.1 },
  { formula: "(C₁₂H₁₈O₉)n", name: "carrageenan", amount: 96.2 },
  { formula: "[Si(CH₃)₂O]n", name: "dimethylpolysiloxane", amount: 47.7 },
  { formula: "Al₂(SO₄)₃", name: "aluminum sulfate", amount: 22.1 },
  { formula: "CaSO₄", name: "calcium sulfate", amount: 41.7 },
  { formula: "Mg₃Si₄O₁₀(OH)₂", name: "talc", amount: 21 },
];

const TOTAL = COMPOUNDS.reduce((sum, compound) => sum + compound.amount, 0);

function formatCalories(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function OtherMealAnalysis({ title }: { title: string }) {
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
      <p className="text-3xl text-red-700">{title}</p>

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
                aria-labelledby="meal-analysis-title"
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
                  <div id="meal-analysis-title" className="text-left">
                    <p className="text-center text-2xl text-red-700">Analysis</p>
                    <ul className="mt-5 max-h-[52vh] space-y-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {COMPOUNDS.map((compound) => (
                        <li
                          key={compound.name}
                          className="flex items-baseline justify-between gap-4"
                        >
                          <span className="text-xl">{compound.formula}</span>
                          <span className="text-xl text-zinc-900 tabular-nums">
                            {formatCalories(compound.amount)} calories
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-baseline justify-between border-t border-zinc-200 pt-3">
                      <span className="text-xl">total</span>
                      <span className="text-xl text-red-700 tabular-nums">
                        {formatCalories(TOTAL)} calories
                      </span>
                    </div>
                  </div>
                ) : (
                  <div id="meal-analysis-title" className="py-8">
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
