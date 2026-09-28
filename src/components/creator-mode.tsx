"use client";

import {
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { BackPill } from "@/components/back-pill";
import { FormChromeProvider, type FormShell } from "@/components/form-chrome";
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
  /** `?type=form1` is the plain form. default and `?type=form2` are the google form. */
  shell?: FormShell;
};

export function CreatorMode({
  backHref = "/",
  YearPicker,
  inlinePicker = false,
  showStartYear = false,
  prompt = "born",
  shell = "google",
}: CreatorModeProps) {
  const [name, setName] = useState(showStartYear ? "build with duy" : "");
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

  const fieldLabel = askingAge ? "how old are you" : "when were you born";
  const fieldPlaceholder = askingAge ? "add your age" : "add your birthyear";
  const picker = inlinePicker ? (
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
      className={
        shell === "google"
          ? [
              "flex w-full cursor-pointer items-center border-b border-[#dadce0] bg-transparent px-0 py-2.5 text-left font-sans text-base tabular-nums outline-none transition hover:border-[#673ab7]",
              year === null ? "text-[#80868b]" : "text-[#202124]",
            ].join(" ")
          : [
              "flex w-full cursor-pointer items-center rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-left font-sans text-sm tabular-nums outline-none transition hover:border-zinc-900",
              year === null ? "text-zinc-400" : "text-zinc-900",
            ].join(" ")
      }
    >
      {year === null ? fieldPlaceholder : String(year)}
    </button>
  );

  return (
    <FormChromeProvider shell={shell}>
      <main
        className={
          shell === "google"
            ? "relative flex min-h-dvh flex-col bg-[#f0ebf8] px-4 py-10 sm:px-8"
            : "relative flex min-h-dvh flex-col bg-white px-6 py-10 sm:px-10 lg:px-16"
        }
      >
        <div
          className={
            shell === "google"
              ? "absolute left-4 top-4 z-20 sm:left-8"
              : "absolute left-6 top-6 z-20 flex flex-col items-start gap-3 sm:left-10 lg:left-16"
          }
        >
          <BackPill href={backHref} />
          {showStartYear && !askingAge ? (
            <div className="mt-3 space-y-1.5">
              <label
                htmlFor="creator-start-year"
                className={
                  shell === "google"
                    ? "block text-sm text-[#5f6368]"
                    : "block text-sm text-zinc-500"
                }
              >
                start year
              </label>
              <input
                id="creator-start-year"
                type="text"
                inputMode="numeric"
                value={startYearText}
                onChange={handleStartYearChange}
                className={
                  shell === "google"
                    ? "w-24 border-b border-[#dadce0] bg-transparent px-0 py-1.5 font-sans text-sm tabular-nums text-[#202124] outline-none transition focus:border-[#673ab7]"
                    : "w-24 rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-sans text-sm tabular-nums text-zinc-900 outline-none transition hover:border-zinc-900 focus:border-zinc-900"
                }
              />
            </div>
          ) : null}
        </div>

        <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center py-8">
          {shell === "google" ? (
            <form
              className="w-full max-w-xl space-y-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="overflow-hidden rounded-lg bg-[#673ab7] px-6 py-7 text-white shadow-sm">
                <h1 className="font-sans text-3xl">interest form</h1>
                <p className="mt-2 text-sm text-white/80">
                  all questions are required
                </p>
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
                  placeholder="your name..."
                  className="mt-4 w-full border-b border-[#dadce0] bg-transparent px-0 py-2 font-sans text-base text-[#202124] outline-none transition placeholder:text-[#80868b] hover:border-[#673ab7] focus:border-[#673ab7]"
                />
              </div>
              <div className="rounded-lg bg-white px-6 py-6 shadow-sm">
                <span className="text-base text-[#202124]">
                  {fieldLabel} <span className="text-[#d93025]">*</span>
                </span>
                <div className="mt-4">{picker}</div>
              </div>
            </form>
          ) : (
            <form
              className="w-full max-w-md space-y-6"
              onSubmit={(event) => event.preventDefault()}
            >
              <h1 className="text-lg text-zinc-900">interest form</h1>
              <div className="space-y-2 text-left">
                <label htmlFor="creator-name" className="text-sm text-zinc-500">
                  name
                </label>
                <input
                  id="creator-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="your name..."
                  className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-900 focus:border-zinc-900"
                />
              </div>
              <div className="space-y-2 text-left">
                <span className="text-sm text-zinc-500">{fieldLabel}</span>
                {picker}
              </div>
            </form>
          )}
        </div>

        {!inlinePicker && modalOpen ? (
          <CreatorModal
            shell={shell}
            title={askingAge ? "pick an age" : "pick a year"}
            onClose={() => setModalOpen(false)}
          >
            <YearPicker
              key={`${minYear}-${maxYear}-modal`}
              yearOnly
              minYear={minYear}
              maxYear={maxYear}
              initialYear={year ?? undefined}
              onYearChange={handleYearChange}
            />
          </CreatorModal>
        ) : null}
      </main>
    </FormChromeProvider>
  );
}

function CreatorModal({
  children,
  onClose,
  title,
  shell,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  shell: FormShell;
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
        className={
          shell === "google"
            ? "relative z-10 flex max-h-[min(92vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border-t-[10px] border-[#673ab7] bg-white shadow-xl"
            : "relative z-10 flex max-h-[min(92vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl"
        }
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
