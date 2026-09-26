"use client";

import {
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { BackPill } from "@/components/back-pill";
import {
  CREATOR_AGE,
  CREATOR_YEAR,
  parseStartYear,
  type YearPickerProps,
} from "@/lib/creator";

type CreatorModeProps = {
  backHref?: string;
  YearPicker: ComponentType<YearPickerProps>;
  /** skip modal — year picker renders inline as the birthyear field */
  inlinePicker?: boolean;
  /** filming control: typed floor for the year range */
  showStartYear?: boolean;
  /** age builds ask how old you are, from 0 to 100 */
  prompt?: "born" | "age";
};

export function CreatorMode({
  backHref = "/",
  YearPicker,
  inlinePicker = false,
  showStartYear = false,
  prompt = "born",
}: CreatorModeProps) {
  const [name, setName] = useState("build with duy");
  const [year, setYear] = useState<number | null>(null);
  const [startYearText, setStartYearText] = useState(String(CREATOR_YEAR.min));
  const [modalOpen, setModalOpen] = useState(false);

  const askingAge = prompt === "age";
  const minYear = askingAge ? CREATOR_AGE.min : parseStartYear(startYearText);
  const maxYear = askingAge ? CREATOR_AGE.max : CREATOR_YEAR.max;

  const handleYearChange = useCallback((next: number) => {
    setYear(next);
  }, []);

  const handleStartYearChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextText = event.target.value;
      setStartYearText(nextText);
      const nextMin = parseStartYear(nextText);
      setYear((current) =>
        current === null || current < nextMin ? null : current,
      );
    },
    [],
  );

  return (
    <main className="relative flex min-h-dvh flex-col bg-[#f0ebf8] px-4 py-10 sm:px-8">
      <div className="absolute left-4 top-4 z-20 sm:left-8">
        <BackPill href={backHref} />
        {showStartYear && !askingAge ? (
          <div className="mt-3 space-y-1.5">
            <label
              htmlFor="creator-start-year"
              className="block text-sm text-[#5f6368]"
            >
              start year
            </label>
            <input
              id="creator-start-year"
              type="text"
              inputMode="numeric"
              value={startYearText}
              onChange={handleStartYearChange}
              className="w-24 border-b border-[#dadce0] bg-transparent px-0 py-1.5 font-sans text-sm tabular-nums text-[#202124] outline-none transition focus:border-[#673ab7]"
            />
          </div>
        ) : null}
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center py-8">
        <form
          className="w-full max-w-xl space-y-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="overflow-hidden rounded-lg bg-[#673ab7] px-6 py-7 text-white shadow-sm">
            <h1 className="font-sans text-3xl">interest form</h1>
            <p className="mt-2 text-sm text-white/80">all questions are required</p>
          </div>

          <div className="rounded-lg border-t-[10px] border-[#673ab7] bg-white px-6 py-6 shadow-sm">
            <label htmlFor="creator-name" className="text-base text-[#202124]">
              name <span className="text-[#d93025]">*</span>
            </label>
            <input
              id="creator-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="your answer"
              className="mt-4 w-full border-b border-[#dadce0] bg-transparent px-0 py-2 font-sans text-base text-[#202124] outline-none transition placeholder:text-[#80868b] hover:border-[#673ab7] focus:border-[#673ab7]"
            />
          </div>

          <div className="rounded-lg bg-white px-6 py-6 shadow-sm">
            <span className="text-base text-[#202124]">
              {askingAge ? "how old are you" : "when were you born"}{" "}
              <span className="text-[#d93025]">*</span>
            </span>
            <div className="mt-4">
            {inlinePicker ? (
              <YearPicker
                key={`${minYear}-${maxYear}`}
                yearOnly
                creatorField
                minYear={minYear}
                maxYear={maxYear}
                initialYear={year ?? undefined}
                onYearChange={handleYearChange}
              />
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={[
                  "flex w-full cursor-pointer items-center border-b border-[#dadce0] bg-transparent px-0 py-2.5 text-left font-sans text-base tabular-nums outline-none transition hover:border-[#673ab7]",
                  year === null ? "text-[#80868b]" : "text-[#202124]",
                ].join(" ")}
              >
                {year === null
                  ? askingAge
                    ? "add your age"
                    : "add your birthyear"
                  : String(year)}
              </button>
            )}
            </div>
          </div>
        </form>
      </div>

      {!inlinePicker && modalOpen ? (
        <CreatorModal
          title={askingAge ? "pick an age" : "pick a year"}
          onClose={() => setModalOpen(false)}
        >
          <YearPicker
            key={`${minYear}-${maxYear}`}
            yearOnly
            minYear={minYear}
            maxYear={maxYear}
            initialYear={year ?? undefined}
            onYearChange={handleYearChange}
          />
        </CreatorModal>
      ) : null}
    </main>
  );
}

function CreatorModal({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="close"
        className="absolute inset-0 cursor-pointer bg-zinc-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[min(92vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border-t-[10px] border-[#673ab7] bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-3">
          <span className="text-sm text-zinc-500">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-8 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
